export class App {
	THICKNESS = 2
	COLOR = "000000"
	dom = null
	instructions = null
	canvas = null
	context = null
	img = new Image()

	constructor() {
		this.img.addEventListener('load', () => { this.drawImage() })
	}

	connectToDOM(dom, selectors) {
		this.dom = dom

		// Canvas - The one thing that's required, throw if it's not specified.
		if (selectors.canvas === undefined) {
			throw new Error("Missing canvas selector.")
		}
		this.canvas = dom.querySelector(selectors.canvas)
		if (this.canvas === null) {
			throw new Error("Missing canvas element.")
		}
		this.context = this.canvas.getContext('2d')

		// Instructions
		if (selectors.instructions !== undefined) {
			this.instructions = dom.querySelector(selectors.instructions)
		}

		// File Input
		if (selectors.fileInput !== undefined) {
			const fileInput = dom.querySelector(selectors.fileInput)
			fileInput.addEventListener('change', (event) => {
				this.setImageFromFile(event.target.files[0])
			})

			// Upload Button
			if (selectors.upload !== undefined) {
				dom.querySelector(selectors.upload).addEventListener('click', () => { fileInput.click() })
			}
		}

		// Clear Button
		if (selectors.clear !== undefined) {
			dom.querySelector(selectors.clear).addEventListener('click', () => { this.clearCanvas() })
		}

		// Copy Button
		if (selectors.copy !== undefined) {
			dom.querySelector(selectors.copy).addEventListener('click', () => { this.copyImageToClipboard() })
		}

		// Download Button
		if (selectors.download !== undefined) {
			dom.querySelector(selectors.download).addEventListener('click', () => { this.download() })
		}

		// Copy/Paste Event Listeners
		dom.addEventListener('copy', (event) => {
            event.preventDefault()
            this.copyImageToClipboard()
        })
		dom.addEventListener('paste', (event) => {
            if (event.clipboardData.files.length > 0) {
				this.setImageFromFile(event.clipboardData.files[0])
            } else {
				this.setDefaultImage()
			}
        })
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

		this.canvas.classList.remove('hidden')
		if (this.instructions) {
			this.instructions.classList.add('hidden')
		}

		this.canvas.width = this.img.naturalWidth + 2 * this.THICKNESS
		this.canvas.height = this.img.naturalHeight + 2 * this.THICKNESS
		this.context.drawImage(this.img, this.THICKNESS, this.THICKNESS)
		this.context.fillStyle = this.COLOR
		this.context.fillRect(0, 0, this.THICKNESS, this.canvas.height)
		this.context.fillRect(0, 0, this.canvas.width, this.THICKNESS)
		this.context.fillRect(this.canvas.width - this.THICKNESS, 0, this.THICKNESS, this.canvas.height)
		this.context.fillRect(0, this.canvas.height - this.THICKNESS, this.canvas.width, this.THICKNESS)
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.canvas.width = 0
		this.canvas.height = 0
		
		this.canvas.classList.add('hidden')
		if (this.instructions) {
			this.instructions.classList.remove('hidden')
		}
	}

	copyImageToClipboard() {
		this.canvas.toBlob((blob) => {
			try {
				navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
			}
			catch (error) {
				alert('Copying is not enabled in your browser settings.')
			}
		})
	}

	download() {
		const link = this.dom.createElement('a')
		link.download = 'image.png'
		link.href = this.canvas.toDataURL()
		link.click()
	}
}
