import Head from 'next/head'
import { mainData } from '@/lib/data'
import { APKDownloader, Comments, Content, Faqs } from '@/components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Button, Card, CardBody, CardHeader, Divider, Image, Input, Link } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Home() {
    const router = useRouter();
    const { locales, locale: activeLocal, defaultLocale } = router;

    const { t } = useTranslation()

    const [input, setInput] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloadReady, setIsDownloadReady] = useState(false);

    const validateInput = (input) => {
        // Regular expression to match either a package name or a Google Play Store URL
        const regex = /^(?:[a-zA-Z0-9]+\.)+[a-zA-Z0-9]+$/;
        const urlRegex = /^https?:\/\/play\.google\.com\/store\/(apps|games)\/details\?id=([^\&]+)/;

        // Check if input matches either the regex or the URL regex
        if (regex.test(input) || urlRegex.test(input)) {
            setErrorMessage('');
            return true;
        } else {
            setErrorMessage(t("Invalid input format. Please enter a valid package name or Google Play Store URL."));
            return false;
        }
    }

    const extractPackageName = (input) => {
        // Regular expression to extract the package name from a Google Play Store URL
        const urlRegex = /^https?:\/\/play\.google\.com\/store\/(apps|games)\/details\?id=([^\&]+)/;

        // Execute the regex on the input
        const match = input.match(urlRegex);

        // If there is a match and the captured group is not empty, return the package name
        if (match && match[2]) {
            return match[2];
        } else {
            // If input is not a URL, return the input as it is (assuming it's a package name)
            return input;
        }
    }

    const handleSubmit = async () => {
        const trimmedInput = input.trim(); // Trim the input

        if (validateInput(trimmedInput)) {
            const extractedPackageName = extractPackageName(trimmedInput);

            if (extractedPackageName) {
                setErrorMessage('');
                try {
                    setIsDownloadReady(false);
                    setData();
                    setIsLoading(true);

                    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/app`, {
                        method: 'POST',
                        body: JSON.stringify({ packageName: extractedPackageName, lang: activeLocal })
                    });

                    const resData = await response.json();

                    if (resData.free && !resData.preregister) {
                        setIsLoading(false);
                        setData(resData);
                        setIsDownloadReady(true);
                    } else {
                        setErrorMessage(t("Oops, downloading isn't possible at the moment due to issues such as an invalid package, non-compatibility, or being in the non-free category."));
                        setIsLoading(false);
                    }
                } catch (error) {
                    // console.error('Error fetching data:', error);
                    setErrorMessage('Error fetching data:', error);
                    setIsLoading(false);
                    setIsDownloadReady(false);
                }
            } else {
                setErrorMessage(t("Invalid input format. Please enter a valid package name or Google Play Store URL."));
            }
        }
    }

    const download = () => {
        // Create a hidden anchor tag
        const anchor = document.createElement('a');
        anchor.style.display = 'none';

        // Set the URL of the file to download
        anchor.href = `https://d.apkpure.com/b/APK/${data.appId}?version=latest`;
        anchor.download = 'your_app.apk'; // Set the filename

        // Append the anchor to the document body
        document.body.appendChild(anchor);

        // Programmatically click the anchor to trigger the download
        anchor.click();

        // Remove the anchor from the document body after download
        document.body.removeChild(anchor);
    }

    return (
        <>
            <Head>
                <title>{t("seo.title")}</title>
                <meta name="description" content={t("seo.description")} />
                <meta name="keywords" content={t("seo.keywords")} />
            </Head>
            <main>
                {/* Tool */}
                <div className="max-w-4xl my-16 px-4 sm:px-6 lg:px-8 mx-auto">
                    <Card>
                        <CardHeader className="flex gap-3">
                            {t("tool.title")}
                        </CardHeader>
                        <Divider />
                        <CardBody className="space-y-6">
                            {/* App Data */}
                            {data && (
                                <div className="mb-6">
                                    {/* App Info */}
                                    <div className="flex justify-between">
                                        <div>
                                            {/* Icon & Title & Version & Developer */}
                                            <div className="flex items-center gap-6">
                                                {/* Icon */}
                                                <Image src={data.icon} alt={`${data.title} ${t("icon image")}`} width="80" height="80" loading="lazy" isBlurred className="sm:hidden rounded-xl shadow min-w-20 min-h-20" />
                                                <div>
                                                    {/* Title */}
                                                    <h1 className="text-2xl sm:text-3xl font-bold md:text-4xl lg:text-5xl lg:leading-tight text-foreground">{data.title}</h1>
                                                    <div className="mt-1 sm:mt-3">
                                                        <p className="text-zinc-500 text-sm dark:text-zinc-300 font-normal">{data.summary}</p>
                                                        {/* Version */}
                                                        <p className="text-base text-gray-500 dark:text-neutral-500">{data.version}</p>
                                                        {/* Developer */}
                                                        <Link href={data.developerWebsite} target="_blank">{data.developer}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Icon */}
                                        <div>
                                            <Image src={data.icon} alt={`${data.title} ${t("icon image")}`} loading="lazy" isBlurred className="rounded-[20%] shadow-md w-36 h-36 hidden sm:block md:w-52 md:h-52" />
                                        </div>
                                    </div>

                                    {/* Additional App Information */}
                                    <div>
                                        <h4 className="text-lg font-medium sm:text-xl dark:text-white pb-6 flex items-center gap-1">
                                            {t("Additional App Information")}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Version */}
                                            <div className="flex items-center gap-x-3">
                                                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                                                    <svg className="flex-shrink-0 size-6 fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-base text-start font-semibold text-gray-800 dark:text-white">{t("Version")}</h3>
                                                    <p className="text-sm text-start mt-1 text-gray-600 dark:text-neutral-400">{data.version}</p>
                                                </div>
                                            </div>

                                            {/* Update */}
                                            <div className="flex items-center gap-x-3">
                                                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                                                    <svg className="flex-shrink-0 size-6 fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 15h3v3h2v-3h3v-2h-3v-3h-2v3H8z"></path><path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm.002 16H5V8h14l.002 12z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-base text-start font-semibold text-gray-800 dark:text-white">{t("Update")}</h3>
                                                    <p className="sm text-start mt-1 text-gray-600 dark:text-neutral-400">{new Date(data.updated).toLocaleDateString('en-GB')}</p>
                                                </div>
                                            </div>

                                            {/* Developer */}
                                            <div className="flex items-center gap-x-3">
                                                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                                                    <svg className="flex-shrink-0 size-6 fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-base text-start font-semibold text-gray-800 dark:text-white">{t("Developer")}</h3>
                                                    <Link href={data.developerWebsite} target="_blank" className="text-sm mt-1">{data.developer}</Link>
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div className="flex items-center gap-x-3">
                                                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                                                    <svg className="flex-shrink-0 size-6 fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11 4h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4v4zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-base text-start font-semibold text-gray-800 dark:text-white">{t("Category")}</h3>
                                                    <p className="sm text-start mt-1 text-gray-600 dark:text-neutral-400">{data.genre}</p>
                                                </div>
                                            </div>

                                            {/* Package Name */}
                                            <div className="flex items-center gap-x-3">
                                                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                                                    <svg className="flex-shrink-0 size-6 fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m12.954 11.616 2.957-2.957L6.36 3.291c-.633-.342-1.226-.39-1.746-.016l8.34 8.341zm3.461 3.462 3.074-1.729c.6-.336.929-.812.929-1.34 0-.527-.329-1.004-.928-1.34l-2.783-1.563-3.133 3.132 2.841 2.84zM4.1 4.002c-.064.197-.1.417-.1.658v14.705c0 .381.084.709.236.97l8.097-8.098L4.1 4.002zm8.854 8.855L4.902 20.91c.154.059.32.09.495.09.312 0 .637-.092.968-.276l9.255-5.197-2.666-2.67z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-base text-start font-semibold text-gray-800 dark:text-white">{t("Package Name")}</h3>
                                                    <p className="sm text-start mt-1 text-gray-600 dark:text-neutral-400">{data.appId}</p>
                                                </div>
                                            </div>

                                            {/* Downloads */}
                                            <div className="flex items-center gap-x-3">
                                                <div className="flex justify-center items-center size-12 bg-blue-600 rounded-xl">
                                                    <svg className="flex-shrink-0 size-6 fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m12 16 4-5h-3V4h-2v7H8z"></path><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-base text-start font-semibold text-gray-800 dark:text-white">{t("Downloads")}</h3>
                                                    <p className="sm text-start mt-1 text-gray-600 dark:text-neutral-400">{data.installs}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Input value={input} onChange={((e) => setInput(e.target.value))} type="text" label={t("tool.input_label")} placeholder={t("tool.input_placeholder")} />
                            {errorMessage && <p dir="auto" className="text-red-600 dark:text-red-500 text-start">{errorMessage}</p>}

                            {isLoading ? (
                                <Button color="primary" fullWidth isLoading>
                                    {t("tool.generate_download")}...
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} color="primary" fullWidth>
                                    {t("tool.generate_download")}
                                </Button>
                            )}

                            {isDownloadReady && (
                                <Button onClick={download} color="success" fullWidth>
                                    {t("tool.download_button")}
                                </Button>
                            )}    

<Button
  color="secondary"
  fullWidth
  onClick={() => {
    const ref = document.referrer;

    // Revisamos si viene de Nebhula
    if (ref.includes("nebhula.com")) {
      // Intentamos volver atrás
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Si no hay historial, redirigimos a la sección específica
        window.location.href = "https://nebhula.com#seccion-especifica";
      }
    } else {
      // No viene de Nebhula: redirigimos al fallback
      window.location.href = "https://nebhula.com#seccion-especifica";
    }
  }}
>
  Volver
</Button>

                        </CardBody>
                         



                    </Card>




                                                                                                                                        

















import { useState, useEffect } from "react";

export default function Home() {
  // Base de datos de apps/juegos
  const packageAppsAndGames = [
    {
      id: 1,
      name: "WhatsApp Messenger",
      packageName: "com.whatsapp",
      description: "Aplicación de mensajería instantánea",
      type: "app",
      category: "Comunicación",
      rating: 4.5,
      downloads: "5B+",
      developer: "WhatsApp LLC",
      popularity: 100,
      iconUrl:
        "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN",
    },
    {
      id: 2,
      name: "Candy Crush Saga",
      packageName: "com.king.candycrushsaga",
      description: "Juego de puzle con dulces",
      type: "game",
      category: "Puzzle",
      rating: 4.6,
      downloads: "1B+",
      developer: "King",
      popularity: 95,
      iconUrl:
        "https://play-lh.googleusercontent.com/TLUeelx8wcpEzf3hoqeLxPs3ai1tdGtAZT2kNf6oUz6KRUl2rYXGcO817S1L4P33PcU",
    },
    {
      id: 3,
      name: "Spotify - Música y Podcasts",
      packageName: "com.spotify.music",
      description: "Escucha millones de canciones",
      type: "app",
      category: "Música",
      rating: 4.8,
      downloads: "1B+",
      developer: "Spotify AB",
      popularity: 90,
      iconUrl:
        "https://play-lh.googleusercontent.com/P2VMEenhpKhqekKkKvO8l7o1sA9RAo5Ub3q26rgVU8GJvhd9thQ9pyX5srz-1pVrYw",
    },
    {
      id: 4,
      name: "Minecraft",
      packageName: "com.mojang.minecraftpe",
      description: "Juego de aventuras y construcción",
      type: "game",
      category: "Aventura",
      rating: 4.7,
      downloads: "500M+",
      developer: "Mojang",
      popularity: 85,
      iconUrl:
        "https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP",
    },
    {
      id: 5,
      name: "Instagram",
      packageName: "com.instagram.android",
      description: "Comparte fotos y videos",
      type: "app",
      category: "Redes Sociales",
      rating: 4.4,
      downloads: "5B+",
      developer: "Instagram",
      popularity: 98,
      iconUrl:
        "https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLas1RRWCZ3dgryBoA1ibECdCd6uXJPOI23TresxVxqCQ",
    },
    {
      id: 6,
      name: "Among Us",
      packageName: "com.innersloth.amongus",
      description: "Encuentra al impostor",
      type: "game",
      category: "Estrategia",
      rating: 4.5,
      downloads: "500M+",
      developer: "InnerSloth LLC",
      popularity: 88,
      iconUrl:
        "https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hn-sruLec",
    },
    {
      id: 7,
      name: "Adobe Photoshop Express",
      packageName: "com.adobe.psmobile",
      description: "Editor de fotos",
      type: "app",
      category: "Foto",
      rating: 4.3,
      downloads: "500M+",
      developer: "Adobe",
      popularity: 80,
      iconUrl:
        "https://play-lh.googleusercontent.com/7p7lR_2Lwfzo7iC-4YMsYk3M3C7M-3TZ5R7y6y6x9x9x9x9x9x9x9x9x9x9x9x9x9",
    },
    {
      id: 8,
      name: "Asphalt 9: Legends",
      packageName: "com.gameloft.android.ANMP.GloftA9HM",
      description: "Juego de carreras",
      type: "game",
      category: "Carreras",
      rating: 4.6,
      downloads: "100M+",
      developer: "Gameloft SE",
      popularity: 82,
      iconUrl:
        "https://play-lh.googleusercontent.com/3pVej2i9hq5FRdJcVcL3W2Qa9cX0n3n3n3n3n3n3n3n3n3n3n3n3n3n3n3n3n3n3",
    },
    {
      id: 9,
      name: "Netflix",
      packageName: "com.netflix.mediaclient",
      description: "Servicio de streaming",
      type: "app",
      category: "Entretenimiento",
      rating: 4.6,
      downloads: "1B+",
      developer: "Netflix, Inc.",
      popularity: 92,
      iconUrl:
        "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9f2XW9BDJPhmjZJ4e5z0U",
    },
    {
      id: 10,
      name: "Clash of Clans",
      packageName: "com.supercell.clashofclans",
      description: "Juego de estrategia",
      type: "game",
      category: "Estrategia",
      rating: 4.7,
      downloads: "500M+",
      developer: "Supercell",
      popularity: 89,
      iconUrl:
        "https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHlHb7FgF20P7F7Q",
    },
    {
      id: 11,
      name: "Telegram",
      packageName: "org.telegram.messenger",
      description: "Mensajería rápida y segura",
      type: "app",
      category: "Comunicación",
      rating: 4.3,
      downloads: "500M+",
      developer: "Telegram FZ-LLC",
      popularity: 87,
      iconUrl:
        "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-xgCq0Pt4xKkCHv6k7K7pG2A",
    },
    {
      id: 12,
      name: "Subway Surfers",
      packageName: "com.kiloo.subwaysurf",
      description: "Juego de carreras sin fin",
      type: "game",
      category: "Carreras",
      rating: 4.5,
      downloads: "1B+",
      developer: "SYBO Games",
      popularity: 90,
      iconUrl:
        "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-xgCq0Pt4xKkCHv6k7K7pG2A",
    },
  ];

  const packageApkDownloadUrl = "https://nebhulapk.vercel.app/es";

  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentSort, setCurrentSort] = useState("relevance");
  const [results, setResults] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [redirectPackage, setRedirectPackage] = useState("");
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Funciones
  const performSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = packageAppsAndGames.filter((item) => {
        const matchesSearch =
          searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.packageName.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (currentFilter !== "all") {
          if (currentFilter === "popular") {
            matchesFilter = item.popularity > 90;
          } else {
            matchesFilter = item.type === currentFilter;
          }
        }
        return matchesSearch && matchesFilter;
      });

      // Ordenar
      filtered = sortResults(filtered, currentSort);
      setResults(filtered);
      setLoading(false);
    }, 300);
  };

  const sortResults = (res, sortBy) => {
    switch (sortBy) {
      case "popularity":
        return [...res].sort((a, b) => b.popularity - a.popularity);
      case "rating":
        return [...res].sort((a, b) => b.rating - a.rating);
      case "relevance":
      default:
        return res;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowNotification(true);
    setRedirectPackage(text);
    setShowRedirectModal(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const redirectToDownload = (packageName) => {
    window.location.href =
      packageApkDownloadUrl + "?package=" + encodeURIComponent(packageName);
  };

  // Efecto para buscar cuando cambia filtro u orden
  useEffect(() => {
    performSearch();
  }, [currentFilter, currentSort]);

  return (
    <div className="package-finder-container">
      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Estilos completos */}
      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
        }
        .package-finder-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          background: linear-gradient(to bottom, #160145, #000000);
          border-radius: 12px;
          overflow: hidden;
          padding: 0;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .package-finder-search {
          padding: 20px;
          background: rgba(0, 0, 0, 0.7);
          border-bottom: 2px solid #34a853;
        }
        .package-search-container {
          display: flex;
          width: 100%;
          margin-bottom: 15px;
        }
        #package-search-input {
          flex: 1;
          padding: 16px 18px;
          border: 2px solid #4285f4;
          border-radius: 8px 0 0 8px;
          font-size: 16px;
          background: #000;
          color: white;
        }
        #package-search-btn {
          padding: 0 25px;
          background: linear-gradient(to right, #4285f4, #34a853);
          color: white;
          border: none;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s;
        }
        #package-search-btn:hover {
          background: linear-gradient(to right, #34a853, #4285f4);
          transform: scale(1.02);
        }
        .package-filters {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 15px;
        }
        .package-filter-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid #4285f4;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        .package-filter-btn:hover {
          background: rgba(66, 133, 244, 0.2);
        }
        .package-filter-btn.active {
          background: #4285f4;
          color: white;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(66, 133, 244, 0.5);
        }
        .package-results-section {
          padding: 20px;
        }
        .package-results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 0 10px;
        }
        .package-results-count {
          font-size: 16px;
          color: #34a853;
          font-weight: bold;
        }
        .package-sort-select {
          padding: 8px 15px;
          border: 1px solid #4285f4;
          border-radius: 20px;
          background: #000;
          color: white;
          font-size: 14px;
        }
        .package-apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 5px;
          width: 100%;
        }
        .package-app-card {
          background: linear-gradient(to bottom, #1a1a2e, #16213e);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid #4285f4;
          width: 100%;
        }
        .package-app-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(66, 133, 244, 0.4);
        }
        .package-app-header {
          display: flex;
          padding: 20px;
          align-items: center;
          border-bottom: 1px solid rgba(66, 133, 244, 0.3);
          background: rgba(0, 0, 0, 0.2);
        }
        .package-app-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(66, 133, 244, 0.5);
        }
        .package-app-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .package-app-title {
          font-size: 18px;
          font-weight: bold;
          color: white;
        }
        .package-app-developer {
          font-size: 14px;
          color: #34a853;
          margin-top: 5px;
        }
        .package-app-body {
          padding: 20px;
        }
        .package-app-description {
          color: #cccccc;
          font-size: 14px;
          margin-bottom: 15px;
          line-height: 1.5;
        }
        .package-id {
          background: rgba(0, 0, 0, 0.4);
          padding: 15px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          word-break: break-all;
          margin-bottom: 15px;
          border: 1px dashed #4285f4;
          color: #ffffff;
        }
        .package-action-buttons {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .package-copy-btn,
        .package-download-btn {
          flex: 1;
          padding: 10px 15px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.3s;
        }
        .package-copy-btn {
          background: #4285f4;
          color: white;
        }
        .package-copy-btn:hover {
          background: #34a853;
        }
        .package-download-btn {
          background: #34a853;
          color: white;
        }
        .package-download-btn:hover {
          background: #4285f4;
        }
        .package-app-footer {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 10px 0;
          background: rgba(0, 0, 0, 0.2);
          font-size: 14px;
          color: white;
        }
        .package-notification {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #34a853;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s;
          z-index: 9999;
        }
        .package-notification.show {
          opacity: 1;
          pointer-events: auto;
        }
        .package-redirect-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s;
          z-index: 9999;
        }
        .package-redirect-modal.show {
          opacity: 1;
          pointer-events: auto;
        }
        .package-modal-content {
          background: #1a1a2e;
          padding: 30px;
          border-radius: 15px;
          width: 90%;
          max-width: 500px;
          text-align: center;
          color: white;
          box-shadow: 0 8px 25px rgba(66, 133, 244, 0.5);
        }
        .package-modal-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 20px;
        }
        .package-modal-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.3s;
        }
        .package-confirm {
          background: #34a853;
          color: white;
        }
        .package-cancel {
          background: #4285f4;
          color: white;
        }
        .package-modal-btn:hover {
          opacity: 0.8;
        }
        .package-loading, .package-no-results {
          color: white;
          text-align: center;
          font-size: 16px;
          padding: 30px;
          grid-column: 1/-1;
        }
      `}</style>

      {/* Buscador */}
      <div className="package-finder-search">
        <div className="package-search-container">
          <input
            type="text"
            id="package-search-input"
            placeholder="Buscar aplicaciones o juegos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && performSearch()}
          />
          <button id="package-search-btn" onClick={performSearch}>
            <i className="fas fa-search"></i> Buscar
          </button>
        </div>

        <div className="package-filters">
          {["all", "app", "game", "popular"].map((f) => (
            <button
              key={f}
              className={`package-filter-btn ${
                currentFilter === f ? "active" : ""
              }`}
              onClick={() => setCurrentFilter(f)}
            >
              {f === "all"
                ? "Todos"
                : f === "app"
                ? "Aplicaciones"
                : f === "game"
                ? "Juegos"
                : "Populares"}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="package-results-section">
        <div className="package-results-header">
          <div className="package-results-count">{results.length} resultados</div>
          <select
            className="package-sort-select"
            value={currentSort}
            onChange={(e) => setCurrentSort(e.target.value)}
          >
            <option value="relevance">Relevancia</option>
            <option value="popularity">Popularidad</option>
            <option value="rating">Puntuación</option>
          </select>
        </div>

        <div className="package-apps-grid" id="package-apps-grid">
          {loading && (
            <div className="package-loading">
              <i className="fas fa-spinner fa-spin"></i> Buscando aplicaciones...
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="package-no-results">
              <p>
                Ingresa un término de búsqueda para encontrar aplicaciones y sus
                nombres de paquetes
              </p>
            </div>
          )}
          {!loading &&
            results.map((item) => (
              <div className="package-app-card" key={item.id}>
                <div className="package-app-header">
                  <div className="package-app-icon">
                    <img src={item.iconUrl} alt={item.name} />
                  </div>
                  <div>
                    <div className="package-app-title">{item.name}</div>
                    <div className="package-app-developer">{item.developer}</div>
                  </div>
                </div>
                <div className="package-app-body">
                  <p className="package-app-description">{item.description}</p>
                  <div className="package-id">{item.packageName}</div>
                  <div className="package-action-buttons">
                    <button
                      className="package-copy-btn"
                      onClick={() => copyToClipboard(item.packageName)}
                    >
                      <i className="fas fa-copy"></i> Copiar paquete
                    </button>
                    <button
                      className="package-download-btn"
                      onClick={() => redirectToDownload(item.packageName)}
                    >
                      <i className="fas fa-download"></i> Descargar APK
                    </button>
                  </div>
                </div>
                <div className="package-app-footer">
                  <span>⭐ {item.rating}</span>
                  <span>{item.downloads}</span>
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Notificación */}
      {showNotification && (
        <div className="package-notification show">
          <i className="fas fa-check-circle"></i> Paquete copiado al portapapeles
        </div>
      )}

      {/* Modal de redirección */}
      {showRedirectModal && (
        <div className="package-redirect-modal show">
          <div className="package-modal-content">
            <h3>Redireccionando para descarga</h3>
            <p>
              Has copiado el nombre del paquete: <strong>{redirectPackage}</strong>
            </p>
            <p>
              Serás redirigido a Nebhula APK donde podrás descargar la
              aplicación.
            </p>
            <div className="package-modal-buttons">
              <button
                className="package-modal-btn package-confirm"
                onClick={() => redirectToDownload(redirectPackage)}
              >
                <i className="fas fa-download"></i> Continuar
              </button>
              <button
                className="package-modal-btn package-cancel"
                onClick={() => setShowRedirectModal(false)}
              >
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}














      
<br/>
<div style={{ width: '100%', margin: 0, padding: 0, textAlign: 'center', backgroundColor: '#' }}>
  {/* Bloque de imagen de Blogger con link */}
<div
  style={{
    marginBottom: '1.5em',
    width: '100%',
    cursor: 'pointer',
  }}
>
  <a href="https://www.nebhula.com/" style={{ display: 'block', width: '100%' }}>
    <img
      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtr3TVkYIiHBJxve5EaXvwRZIX7QsAYj4XOYqpApap7S3ch-fXqDdGAKS-_ZC4-HYibnPB9GS8MH97Wzpdl6C3Flb7--lzK32HWoXQk_HNZJXA3flgx-mOJaGYC5FFRKK-zeBlLaUMP8TJdayNvsy53V3PqedwYyrTmJvccyQPphJ0hora7-95dL8BxCg/s1600/Copia%20de%20Copia%20de%20king%20%2820%29.png"
      alt="Imagen Blogger"
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        display: 'block',
      }}
    />
  </a>
</div>


{/* Bloque de imagen de Blogger con link */}
<div style={{ width: '100%' }}>
  <a href="https://avianuncios.com/usuario-pro" style={{ display: 'block', width: '100%' }}>
    <img
      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhNEb9yJAvnSoTCz_Kg43mZ2P5p1JHpjXO5gcPZRL2kU9UjXvHc0rxZimHLsp4eaB1w9Qi-QVuZL-_VdTp6ltf7B_qU9k2KdD0Q_RmhTNWFAhH7X0fe0b18Iy5Q2hH63uNeoqmEaj16umMJrf2jBa8T5i6MvJxSpHXMgsE4B-T5GRB_Rsv_Yq6DAp3AzVc/s1600/Copia%20de%20Copia%20de%20king%20%2824%29.png"
      alt="Imagen Blogger"
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        display: 'block',
      }}
    />
  </a>
</div>

<br/>

                                
  {/* Bloque "Anúnciate aquí" */}
  <div style={{ width: '100%' }}>
    <a href="https://tu-link-del-anuncio.com" style={{ display: 'block', width: '100%' }}>
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: '#',
          color: '#333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px dashed #aaa',
          borderRadius: '12px',
          fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
        }}
      >
        Tu anuncio publicitario aquí
      </div>
    </a>
  </div>
</div>


                            
                </div>

                {/* Content */}
                <Content content={t("content.html")} />

                {/* FAQS */}
                <Faqs />

                {/* Comments */}
                {mainData.enableComments && (
                    <Comments websiteName={t("website_name")} />
                )}
            </main>
        </>
    )
}


export async function getStaticProps(context) {
    // extract the locale identifier from the URL
    const { locale } = context

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}
