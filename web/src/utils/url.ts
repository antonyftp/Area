export const Url = {
    getPathName: () => window.location.pathname,

    replacePathName: (pathname: string) => {
        console.log(window.location.pathname)
        window.location.pathname.replace(/[^/]*$/, pathname)
    }
}
