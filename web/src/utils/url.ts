export const Url = {
    getPathName: () => window.location.pathname,

    replacePathName: (pathname: string) => {
        window.location.pathname.replace(/[^/]*$/, pathname)
    }
}
