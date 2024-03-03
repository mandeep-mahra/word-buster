import "./App.css";
export default function( props ){
    const top = Math.floor(Math.random()*80)
    const left = Math.floor(Math.random()*80)
    const textStyle = {
        position: 'absolute',
        top: top + '%',
        left: left + '%',
    }
    return (
        <>
            <div className="dispWord" style={textStyle}>
                {props.word}
            </div>
        </>
    )
}