export class App {
	THICKNESS = 2
	COLOR = "000000"

	constructor(canvasElement, fileInputElement) {
		this.canvasElement = canvasElement
		this.canvasContext = canvasElement.getContext('2d')
		
		this.fileInputElement = fileInputElement
        this.fileInputElement.addEventListener('change', (event) => {
            this.setImageFromFile(event.target.files[0])
        })
		
		this.img = new Image()
		this.img.addEventListener('load', () => { this.drawImage() })
	}

	setDefaultImage() {
		this.img.src = "./assets/images/picard.webp"
	}

	setImageFromFile(file) {
		if (file.type.startsWith("image/")) {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {this.img.src = reader.result}
		} else {
			this.setDefaultImage()
		}
	}

	drawImage() {
		this.clearCanvas()
		this.canvasElement.width = this.img.naturalWidth + 2 * this.THICKNESS
		this.canvasElement.height = this.img.naturalHeight + 2 * this.THICKNESS
		this.canvasContext.drawImage(this.img, this.THICKNESS, this.THICKNESS)
		this.canvasContext.fillStyle = this.COLOR
		this.canvasContext.fillRect(0, 0, this.THICKNESS, this.canvasElement.height)
		this.canvasContext.fillRect(0, 0, this.canvasElement.width, this.THICKNESS)
		this.canvasContext.fillRect(this.canvasElement.width - this.THICKNESS, 0, this.THICKNESS, this.canvasElement.height)
		this.canvasContext.fillRect(0, this.canvasElement.height - this.THICKNESS, this.canvasElement.width, this.THICKNESS)
	}

	clearCanvas() {
		this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
		this.canvasElement.width = 0
		this.canvasElement.height = 0
	}

	triggerFilePicker() {
		this.fileInputElement.click()
	}

	copyImageToClipboard() {
		this.canvasElement.toBlob((blob) => {
			try {
				navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
			}
			catch (error) {
				alert('Copying is not enabled in your browser settings.')
			}
		})
	}

	download() {
		const link = document.createElement('a')
		link.download = 'image.png'
		link.href = this.canvasElement.toDataURL()
		link.click()
	}
}
