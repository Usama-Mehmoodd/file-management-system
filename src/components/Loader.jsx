import { TailSpin } from 'react-loader-spinner'

function Loader() {
    
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                minHeight: '100vh'
            }}
        >
            <TailSpin
                height="100"
                width="100"
                color="#3f423f"
                ariaLabel="tail-spin-loading"
                visible={true}
            />
        </div>
    )
}

export default Loader;