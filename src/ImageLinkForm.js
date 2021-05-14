import React from "react"
import "./ImageLinkForm.css"

const ImageLinkForm = ({onInputChange,onSubmit}) => {
	return (
		<div>
			<p className="f3 center">
				{"this Magic Brain will detect your faces in pictures"}	 
			</p>
			<div className="center">
				<div className=" center form pa4 br3 shadow-5">
					<input className="f4 pa3 w-80 center" type="tex"  onChange={onInputChange}/>
					<button className="w-30 grow link ph3 pv2 dib white bg-light-purple"  onClick={onSubmit}>detect</button>
				</div>

			</div>
		</div>	
		);
}

export default ImageLinkForm;