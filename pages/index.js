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




                                                                                                                                        







// pages/index.js
import { useEffect, useRef } from 'react';

export default function PackageFinder() {
  const appsGridRef = useRef(null);
  const searchInputRef = useRef(null);
  const resultsCountRef = useRef(null);
  const loadMoreBtnRef = useRef(null);
  const modalRef = useRef(null);
  const notificationRef = useRef(null);

  const packageAppsAndGames = [
    { id: 1, name: "WhatsApp", packageName: "com.whatsapp", description: "Mensajería instantánea segura con cifrado de extremo a extremo. Comparte mensajes, fotos, videos y realiza videollamadas con tus contactos.", type: "app", category: "Comunicación", rating: 4.5, downloads: "5B+", developer: "WhatsApp LLC", popularity: 100, iconUrl: "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN" },
    { id: 2, name: "Candy Crush Saga", packageName: "com.king.candycrushsaga", description: "Un adictivo juego de rompecabezas con cientos de niveles. Combina dulces del mismo color en filas de tres o más.", type: "game", category: "Puzzle", rating: 4.6, downloads: "1B+", developer: "King", popularity: 95, iconUrl: "https://play-lh.googleusercontent.com/TLUeelx8wcpEzf3hoqeLxPs3ai1tdGtAZTIFkNqy3gbDp1NPpNFTOzSFJDvZ9narFS0" },
    { id: 3, name: "Spotify - Música y Podcasts", packageName: "com.spotify.music", description: "Escucha millones de canciones, álbumes y podcasts sin anuncios. Crea listas personalizadas y descubre nueva música.", type: "app", category: "Música", rating: 4.8, downloads: "1B+", developer: "Spotify AB", popularity: 90, iconUrl: "https://play-lh.googleusercontent.com/P2VMEenhpKhqekKkKvO8l7o1sA9RAo5Ub3q26rgVU8GJvhd9thQ9pyX5srz-1pVrYw" },
    { id: 4, name: "Minecraft", packageName: "com.mojang.minecraftpe", description: "Un mundo abierto de bloques donde puedes construir, explorar y sobrevivir. Únete a amigos en servidores multijugador.", type: "game", category: "Aventura", rating: 4.7, downloads: "500M+", developer: "Mojang", popularity: 85, iconUrl: "https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP" },
    { id: 5, name: "Instagram", packageName: "com.instagram.android", description: "Comparte tus momentos con fotos y videos. Descubre contenido de creadores, sigue tus marcas favoritas.", type: "app", category: "Redes Sociales", rating: 4.4, downloads: "5B+", developer: "Instagram", popularity: 98, iconUrl: "https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLas1RRWCZ3dgryBoA1ibECdCd6uXJPOI23TresxVxqCQ" },
    { id: 6, name: "Among Us", packageName: "com.innersloth.amongus", description: "Trabaja con tu tripulación para completar tareas, pero ¡cuidado! Uno o más impostores están entre ustedes.", type: "game", category: "Estrategia", rating: 4.5, downloads: "500M+", developer: "InnerSloth LLC", popularity: 88, iconUrl: "https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec=w240-h480-rw" },
    { id: 7, name: "Adobe Photoshop Express", packageName: "com.adobe.psmobile", description: "Editor de fotos profesional para móviles. Recorta, ajusta colores, aplica filtros, elimina objetos.", type: "app", category: "Foto", rating: 4.3, downloads: "500M+", developer: "Adobe", popularity: 80, iconUrl: "https://play-lh.googleusercontent.com/7p7lR_2Lwfzo7iC-4YMsYk3M3C7M-3TZ5R7y6y6x9x9x9x9x9x9x9x9x9x9x9x9x9x9" },
    { id: 8, name: "Asphalt 9: Legends", packageName: "com.gameloft.android.ANMP.GloftA9HM", description: "Carreras de alta velocidad con coches de lujo en escenarios espectaculares. Domina curvas extremas.", type: "game", category: "Carreras", rating: 4.6, downloads: "100M+", developer: "Gameloft SE", popularity: 82, iconUrl: "https://play-lh.googleusercontent.com/3pVej2i9hq5FRdJcVcL3W2Qa9cX0n3n3n3n3n3n3n3n3n3n3n3n3n3n3n3n3n3" },
    { id: 9, name: "Netflix", packageName: "com.netflix.mediaclient", description: "El mejor servicio de streaming con series, películas, documentales y originales.", type: "app", category: "Entretenimiento", rating: 4.6, downloads: "1B+", developer: "Netflix, Inc.", popularity: 92, iconUrl: "https://play-lh.googleusercontent.com/2d46rbNS2CLHNfeYkXWqjDepu8IqHFP2d1Ou2qNmWKY728qn-ucu_pkBPmGIeM2UXvA" },
    { id: 10, name: "Clash of Clans", packageName: "com.supercell.clashofclans", description: "Construye tu aldea, entrena un ejército y lucha contra millones de jugadores en este épico juego de estrategia.", type: "game", category: "Estrategia", rating: 4.7, downloads: "500M+", developer: "Supercell", popularity: 89, iconUrl: "https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHlHb7FgF20P7F7Q" },
    { id: 11, name: "Telegram", packageName: "org.telegram.messenger", description: "Mensajería rápida, segura y con funciones avanzadas. Canales, bots, mensajes autodestructibles.", type: "app", category: "Comunicación", rating: 4.3, downloads: "500M+", developer: "Telegram FZ-LLC", popularity: 87, iconUrl: "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-xgCq0Pt4xKkCHv6k7K7pG2A" },
    { id: 12, name: "Subway Surfers", packageName: "com.kiloo.subwaysurf", description: "Corre, salta y deslízate por las vías del tren en este emocionante juego sin fin.", type: "game", category: "Carreras", rating: 4.5, downloads: "1B+", developer: "SYBO Games", popularity: 90, iconUrl: "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-xgCq0Pt4xKkCHv6k7K7pG2A" }
  ];

  const apkDownloadUrl = "https://nebhulapk.vercel.app/es";

  useEffect(() => {
    const searchInput = searchInputRef.current;
    const resultsCount = resultsCountRef.current;
    const loadMoreBtn = loadMoreBtnRef.current;
    const appsGrid = appsGridRef.current;
    const modal = modalRef.current;
    const notification = notificationRef.current;

    let currentFilter = 'all';
    let currentSort = 'relevance';
    let results = [];
    let currentIndex = 0;
    const itemsPerPage = 6;
    let lastCopiedPackage = '';

    const performSearch = () => {
      const searchTerm = (searchInput?.value || '').toLowerCase().trim();
      if (appsGrid) {
        appsGrid.innerHTML = '<div class="package-loading"><i class="fas fa-spinner fa-spin"></i> Buscando...</div>';
      }

      setTimeout(() => {
        let filtered = packageAppsAndGames.filter(item => {
          const matchesSearch = !searchTerm ||
            item.name.toLowerCase().includes(searchTerm) ||
            item.packageName.toLowerCase().includes(searchTerm);
          let matchesFilter = true;
          if (currentFilter === 'popular') matchesFilter = item.popularity > 90;
          else if (currentFilter !== 'all') matchesFilter = item.type === currentFilter;
          return matchesSearch && matchesFilter;
        });

        filtered = sortResults(filtered, currentSort);
        displayResults(filtered);
      }, 300);
    };

    const sortResults = (list, sortBy) => {
      switch (sortBy) {
        case 'popularity': return list.sort((a, b) => b.popularity - a.popularity);
        case 'rating': return list.sort((a, b) => b.rating - a.rating);
        default: return list;
      }
    };

    const displayResults = (list) => {
      results = list;
      currentIndex = 0;
      if (appsGrid) appsGrid.innerHTML = '';
      if (resultsCount) resultsCount.textContent = `${list.length} resultados`;

      if (list.length === 0) {
        if (appsGrid) appsGrid.innerHTML = '<div class="package-no-results"><p>Ingresa un término de búsqueda para encontrar aplicaciones</p></div>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
      }

      showNextResults();
    };

    const showNextResults = () => {
      const start = currentIndex;
      const end = Math.min(start + itemsPerPage, results.length);

      for (let i = start; i < end; i++) {
        const item = results[i];
        const appCard = document.createElement('div');
        appCard.className = 'package-app-card';
        appCard.innerHTML = `
          <div class="package-app-header">
            <div class="package-app-icon">
              <img src="${item.iconUrl.trim()}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNDQ0Ii8+PHRleHQgeD0iMzIiIHk9IjM4IiBmb250LWZhbWlseT0iUm9ib3RvIiBmb250LXNpemU9IjIwIiBmaWxsPSIjZWUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiR7aXRlbS5uYW1lWzBdLnRvVXBwZXJDYXNlKCh9PC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div>
              <div class="package-app-title">${item.name}</div>
              <div class="package-app-developer">${item.developer}</div>
            </div>
          </div>
          <div class="package-app-body">
            <p class="package-app-description">${item.description}</p>
            <div class="package-id">${item.packageName}</div>
            <div class="package-action-buttons">
              <button class="package-download-btn" data-id="${item.id}">
                <i class="fas fa-download"></i> Descargar última versión
              </button>
              <button class="package-versions-toggle" data-id="${item.id}">
                <i class="fas fa-history"></i> Versiones Anteriores
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="package-versions-list" id="versions-${item.id}">
                <a href="#" data-package="${item.packageName}" data-version="15.20.1">v15.20.1 - 120 MB - 2 semanas</a>
                <a href="#" data-package="${item.packageName}" data-version="15.19.0">v15.19.0 - 118 MB - 1 mes</a>
                <a href="#" data-package="${item.packageName}" data-version="15.18.2">v15.18.2 - 117 MB - 2 meses</a>
              </div>
            </div>
          </div>
          <div class="package-app-footer">
            <span><i class="fas fa-star"></i> ${item.rating}</span>
            <span>${item.downloads}</span>
            <span>${item.category}</span>
          </div>
        `;
        appsGrid.appendChild(appCard);
      }

      currentIndex = end;
      if (loadMoreBtn) loadMoreBtn.style.display = currentIndex >= results.length ? 'none' : 'inline-flex';

      attachButtonEvents();
    };

    const attachButtonEvents = () => {
      document.querySelectorAll('.package-download-btn').forEach(btn => {
        btn.onclick = () => {
          const id = parseInt(btn.dataset.id);
          const app = packageAppsAndGames.find(a => a.id === id);
          if (app) {
            navigator.clipboard.writeText(app.packageName);
            showNotification();
            document.getElementById('modal-icon').src = app.iconUrl;
            document.getElementById('modal-name').textContent = app.name;
            document.getElementById('modal-developer').textContent = app.developer;
            document.querySelector('#modal-category .cat-text').textContent = app.category;
            document.getElementById('modal-rating').textContent = app.rating;
            document.getElementById('modal-downloads').textContent = app.downloads;
            lastCopiedPackage = app.packageName;
            modal.classList.add('show');
          }
        };
      });

      document.querySelectorAll('.package-versions-toggle').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const list = document.getElementById(`versions-${id}`);
          list.classList.toggle('show');
          const icon = btn.querySelector('.fa-chevron-down');
          icon.classList.toggle('fa-rotate-180');
        };
      });

      document.querySelectorAll('.package-versions-list a').forEach(link => {
        link.onclick = (e) => {
          e.preventDefault();
          const pkg = link.dataset.package;
          const version = link.dataset.version;
          navigator.clipboard.writeText(`${pkg} (v${version})`);
          alert(`Versión copiada: ${pkg} (v${version})`);
        };
      });
    };

    const showNotification = () => {
      if (notification) {
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 2000);
      }
    };

    // Inicializar
    performSearch();

    // Eventos
    searchInput?.addEventListener('keyup', e => e.key === 'Enter' && performSearch());
    document.getElementById('package-sort-select')?.addEventListener('change', (e) => {
      currentSort = e.target.value;
      performSearch();
    });
    loadMoreBtn?.addEventListener('click', showNextResults);

    const filterBtns = document.querySelectorAll('.package-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        performSearch();
      });
    });

    document.getElementById('modal-close-btn')?.addEventListener('click', () => {
      modal.classList.remove('show');
    });

    document.getElementById('modal-download-btn')?.addEventListener('click', () => {
      window.location.href = `${apkDownloadUrl}?package=${encodeURIComponent(lastCopiedPackage)}`;
    });

  }, []);

  return (
    <>
      {/* CSS Global */}
      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
        }
        body {
          background: #000;
          overflow-x: hidden;
        }
        .package-finder-container {
          width: 100%;
          max-width: 100%;
          margin: 0;
          background: linear-gradient(135deg, #0A0A0A, #121212, #1E1E1E);
          border-radius: 0;
          overflow: hidden;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        .package-finder-search {
          padding: 24px 20px;
          background: rgba(10, 10, 10, 0.9);
        }
        .package-search-container {
          display: flex;
          width: 100%;
          margin-bottom: 20px;
        }
        #package-search-input {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid #4CAF50;
          border-right: none;
          border-radius: 12px 0 0 12px;
          font-size: 17px;
          background: rgba(30, 30, 30, 0.6);
          color: #E0E0E0;
        }
        #package-search-input:focus {
          outline: none;
          border-color: #66BB6A;
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
        }
        #package-search-btn {
          padding: 0 16px;
          background: linear-gradient(90deg, #4CAF50, #66BB6A);
          color: white;
          border: none;
          border-radius: 0 12px 12px 0;
          cursor: pointer;
          font-size: 17px;
          font-weight: bold;
        }
        #package-search-btn:hover {
          background: linear-gradient(90deg, #66BB6A, #4CAF50);
          transform: scale(1.03);
        }
        .package-filters-container {
          padding: 14px 0;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .package-filters-container::-webkit-scrollbar {
          display: none;
        }
        .package-filters {
          display: flex;
          gap: 16px;
          padding: 0 16px;
          white-space: nowrap;
        }
        .package-filter-btn {
          flex: 0 0 auto;
          padding: 12px 28px;
          background: rgba(38, 50, 56, 0.2);
          color: #B0BEC5;
          border: 1px solid #455A64;
          border-radius: 30px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s;
        }
        .package-filter-btn:hover {
          background: rgba(38, 50, 56, 0.4);
          color: #E0E0E0;
        }
        .package-filter-btn.active {
          background: linear-gradient(90deg, #4CAF50, #66BB6A);
          color: white;
          font-weight: bold;
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
        }
        .package-results-section {
          padding: 24px 20px;
          background: rgba(16, 16, 16, 0.95);
        }
        .package-results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .package-results-count {
          font-size: 18px;
          color: #66BB6A;
          font-weight: bold;
          text-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
        }
        .package-sort-select {
          padding: 10px 18px;
          border: 1px solid #4CAF50;
          border-radius: 25px;
          background: rgba(30, 30, 30, 0.6);
          color: #E0E0E0;
          font-size: 16px;
          min-width: 140px;
        }
        .package-apps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 0;
        }
        .package-app-card {
          background: linear-gradient(to bottom, #1B1B1B, #141414);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s, box-shadow 0.3s;
          border: none;
          width: 100%;
        }
        .package-app-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 35px rgba(76, 175, 80, 0.2), 0 0 30px rgba(67, 99, 66, 0.3);
        }
        .package-app-header {
          display: flex;
          padding: 24px;
          align-items: center;
          border-bottom: 1px solid rgba(76, 175, 80, 0.1);
          background: rgba(40, 40, 40, 0.1);
        }
        .package-app-icon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          background: #0A0A0A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 18px;
          overflow: hidden;
          box-shadow: 0 0 18px rgba(76, 175, 80, 0.4);
        }
        .package-app-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .package-app-title {
          font-size: 20px;
          font-weight: bold;
          color: #E0E0E0;
        }
        .package-app-developer {
          font-size: 15px;
          color: #78909C;
          margin-top: 5px;
        }
        .package-app-body {
          padding: 24px;
        }
        .package-app-description {
          color: #B0BEC5;
          font-size: 15px;
          margin-bottom: 18px;
          line-height: 1.6;
        }
        .package-id {
          background: rgba(20, 20, 20, 0.7);
          padding: 16px;
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          font-size: 15px;
          word-break: break-all;
          margin-bottom: 18px;
          border: 1px dashed #4CAF50;
          color: #66BB6A;
        }
        .package-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .package-download-btn {
          flex: 1;
          padding: 13px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: bold;
          background: linear-gradient(90deg, #4CAF50, #66BB6A);
          color: white;
        }
        .package-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
        }
        .package-versions-toggle {
          flex: 1;
          padding: 13px;
          border: 1px solid #455A64;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: bold;
          background: #263238;
          color: #B0BEC5;
        }
        .package-versions-toggle:hover {
          background: #37474F;
          color: #E0E0E0;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .package-versions-list {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          margin-top: 10px;
          border-top: 1px solid rgba(76, 175, 80, 0.1);
          padding-top: 10px;
        }
        .package-versions-list.show {
          max-height: 300px;
        }
        .package-versions-list a {
          display: block;
          padding: 10px 15px;
          background: rgba(38, 50, 56, 0.1);
          margin: 6px 0;
          border-radius: 8px;
          color: #66BB6A;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s;
        }
        .package-versions-list a:hover {
          background: rgba(76, 175, 80, 0.1);
          transform: scale(1.02);
          color: #4CAF50;
        }
        .package-app-footer {
          display: flex;
          justify-content: space-between;
          padding: 18px 24px;
          background: rgba(10, 10, 10, 0.6);
          border-top: 1px solid rgba(76, 175, 80, 0.1);
          font-size: 15px;
          color: #78909C;
        }
        .package-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #B0BEC5;
          width: 100%;
          font-size: 18px;
          grid-column: 1 / -1;
        }
        .package-loading {
          text-align: center;
          padding: 60px 20px;
          color: #B0BEC5;
          width: 100%;
          font-size: 18px;
          grid-column: 1 / -1;
        }
        .package-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 30px;
          background: linear-gradient(90deg, #4CAF50, #66BB6A);
          color: white;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(76, 175, 80, 0.5);
          opacity: 0;
          transition: opacity 0.4s;
          z-index: 1000;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .package-notification.show {
          opacity: 1;
        }
        .package-download-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }
        .package-download-modal.show {
          opacity: 1;
          visibility: visible;
        }
        .package-modal-content {
          background: linear-gradient(to bottom, #1B1B1B, #141414);
          padding: 32px;
          border-radius: 20px;
          max-width: 90%;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          color: white;
          box-shadow: 0 15px 40px rgba(76, 175, 80, 0.3);
          border: none;
          text-align: center;
        }
        .package-modal-content img {
          width: 90px;
          height: 90px;
          border-radius: 18px;
          margin-bottom: 18px;
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
        }
        .package-modal-content h3 {
          font-size: 26px;
          margin-bottom: 8px;
          color: #E0E0E0;
        }
        .developer {
          color: #78909C;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .package-modal-info {
          display: flex;
          justify-content: space-around;
          font-size: 15px;
          color: #B0BEC5;
          margin: 16px 0;
          flex-wrap: wrap;
          gap: 12px;
        }
        .package-modal-info span {
          background: rgba(76, 175, 80, 0.15);
          padding: 8px 16px;
          border-radius: 24px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .package-modal-instruction {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          font-size: 16px;
          color: #66BB6A;
          font-weight: 500;
          line-height: 1.6;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .package-modal-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 24px;
        }
        .package-modal-btn-primary,
        .package-modal-btn-close {
          padding: 14px 28px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 17px;
          font-weight: bold;
          width: 100%;
        }
        .package-modal-btn-primary {
          background: linear-gradient(90deg, #4CAF50, #66BB6A);
          color: white;
        }
        .package-modal-btn-close {
          background: #424242;
          color: white;
        }
        .package-load-more-container {
          text-align: center;
          margin-top: 30px;
        }
        .package-load-more-btn {
          padding: 16px 32px;
          background: linear-gradient(90deg, #4CAF50, #66BB6A);
          color: white;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
        }
        .package-load-more-btn:hover {
          transform: translateY(-3px);
        }

        @media (min-width: 768px) {
          .package-finder-container {
            max-width: 96%;
            margin: 20px auto;
            border-radius: 20px;
          }
          .package-apps-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
          .package-modal-content {
            max-width: 600px;
            width: 90%;
          }
          .package-modal-actions {
            flex-direction: row;
          }
        }
      `}</style>

      {/* HTML */}
      <div className="package-finder-container">
        <div className="package-finder-search">
          <div className="package-search-container">
            <input type="text" id="package-search-input" ref={searchInputRef} placeholder="Buscar aplicaciones o juegos..." />
            <button id="package-search-btn"><i className="fas fa-search"></i></button>
          </div>
          <div className="package-filters-container">
            <div className="package-filters">
              <button className="package-filter-btn active" data-filter="all">Todos</button>
              <button className="package-filter-btn" data-filter="app">Aplicaciones</button>
              <button className="package-filter-btn" data-filter="game">Juegos</button>
              <button className="package-filter-btn" data-filter="popular">Populares</button>
            </div>
          </div>
        </div>

        <div className="package-results-section">
          <div className="package-results-header">
            <div className="package-results-count" ref={resultsCountRef}>0 resultados</div>
            <select className="package-sort-select" id="package-sort-select">
              <option value="relevance">Relevancia</option>
              <option value="popularity">Popularidad</option>
              <option value="rating">Puntuación</option>
            </select>
          </div>

          <div className="package-apps-grid" ref={appsGridRef}>
            <div className="package-no-results">
              <p>Ingresa un término de búsqueda para encontrar aplicaciones y sus nombres de paquetes</p>
            </div>
          </div>

          <div className="package-load-more-container">
            <button id="package-load-more-btn" ref={loadMoreBtnRef} className="package-load-more-btn" style={{ display: 'none' }}>
              <i className="fas fa-plus-circle"></i> Ver más
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="package-download-modal" id="package-download-modal" ref={modalRef}>
        <div className="package-modal-content">
          <img id="modal-icon" src="" alt="Icono" />
          <h3 id="modal-name">Nombre de la App</h3>
          <div className="developer" id="modal-developer">Desarrollador</div>
          <div className="package-modal-info">
            <span id="modal-category"><i className="fas fa-tag"></i> <span className="cat-text"></span></span>
            <span><i className="fas fa-star"></i> <span id="modal-rating">0.0</span></span>
            <span><i className="fas fa-download"></i> <span id="modal-downloads">100M+</span></span>
          </div>
          <div className="package-modal-instruction">
            <i className="fas fa-check-circle"></i>
            <div>¡Perfecto! El nombre del paquete ya fue copiado al portapapeles.<br />Solo pégalo en la página de descarga para obtener la app.</div>
          </div>
          <div className="package-modal-actions">
            <button id="modal-download-btn" className="package-modal-btn-primary">Descargar</button>
            <button id="modal-close-btn" className="package-modal-btn-close">Cerrar</button>
          </div>
        </div>
      </div>

      {/* Notificación */}
      <div className="package-notification" id="package-notification" ref={notificationRef}>
        <i className="fas fa-check-circle"></i> Paquete copiado
      </div>
    </>
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
