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
{/* NUEVO BOTÓN DE VOLVER ABAJO */}
<Button onClick={() => window.history.back()} color="secondary" fullWidth className="mt-2">
     VOLVER A NEBHULA
</Button>
                        </CardBody>
                         



                    </Card>
<br/>
<div style={{ width: '100%', margin: 0, padding: 0, textAlign: 'center', backgroundColor: '#' }}>
  {/* Bloque de imagen de Blogger con función atrás */}
  <div
    style={{
      marginBottom: '1.5em',
      width: '100%',
      cursor: 'pointer',
    }}
    onClick={() => window.history.back()}
  >
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
