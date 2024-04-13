
export default function Loading() {
    return (

        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <img
                src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                alt="Centered Image"
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                }}
            />
        </div>
    )
}