export default function wrapAsync(fn) {
    return (req,res,next) => {
        // catch() errors and chain on next
        fn(req,res,next).catch(next)
    } 
}