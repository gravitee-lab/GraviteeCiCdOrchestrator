
export interface GraviteeBOMSlackTemplate {
	// allParallelExecutionSetProgress: ParallelExecutionSetProgress;
	blocks: SlackBlock[]
}
export interface SlackBlock {
}
export interface SlackSectionText {
	type: string,
	text: string
}
export interface SlackSectionAccessory {
	type: string,
	image_url: string,
	alt_text: string
}


export interface SlackBomDivider extends SlackBlock {
	type: string
}
export interface SlackBomHeader extends SlackBlock {
	type: string,
	text: SlackSectionText
}
export interface SlackBomEntry extends SlackBlock {
	type: string,
	text: SlackSectionText,
	accessory: SlackSectionAccessory
}

let bomDivider: SlackBomDivider = {
	type: "divider"
}

let bomHeader: SlackBomHeader = {
	type: "section",
	text: {
		type: "mrkdwn",
		text: "You have triggered the Release Process with dry run mode  ${DRYN_RUN}, For the *Gravitee APIM Release* version *3.8.0*. Here below is the B.O.M. (Bill of Material) of that release.\n\n *Please check that the Release B.O.M. (Bill of Material) is Ok, and in Circle CI Web UI, Approve or Cancel The Job on hold :*"
	}
}

let bomEntry1: SlackBomEntry = {
	type: "section",
	text: {
		type: "mrkdwn",
		text: "*gravitee-gateway*\n:star::star::star::star: 1528 reviews\n *version: 7.2.8*"
	},
	accessory: {
		type: "image",
		image_url: "https://download.gravitee.io/logo.png",
		alt_text: "alt text for image"
	}
}

let bomEntry2: SlackBomEntry = {
	type: "section",
	text: {
		type: "mrkdwn",
		text: "*gravitee-gateway*\n:star::star::star::star: 1528 reviews\n *version: 7.2.8*"
	},
	accessory: {
		type: "image",
		image_url: "https://download.gravitee.io/logo.png",
		alt_text: "alt text for image"
	}
}

let bomEntry3: SlackBomEntry = {
	type: "section",
	text: {
		type: "mrkdwn",
		text: "*gravitee-gateway*\n:star::star::star::star: 1528 reviews\n *version: 7.2.8*"
	},
	accessory: {
		type: "image",
		image_url: "https://download.gravitee.io/logo.png",
		alt_text: "alt text for image"
	}
}

let bomEntry4: SlackBomEntry = {
	type: "section",
	text: {
		type: "mrkdwn",
		text: "*gravitee-gateway*\n:star::star::star::star: 1528 reviews\n *version: 7.2.8*"
	},
	accessory: {
		type: "image",
		image_url: "https://download.gravitee.io/logo.png",
		alt_text: "alt text for image"
	}
}

let exampleBom: GraviteeBOMSlackTemplate = {
	blocks: [
		  bomHeader,
      bomDivider,
			bomEntry1,
			bomEntry2,
      bomDivider,
			bomEntry3,
			bomEntry4
	]
}
/* {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "You have triggered the Release Process with dry run mode  ${DRYN_RUN}, For the *Gravitee APIM Release* version *3.8.0*. Here below is the B.O.M. (Bill of Material) of that release.\n\n *Please check that the Release B.O.M. (Bill of Material) is Ok, and in Circle CI Web UI, Approve or Cancel The Job on hold :*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*gravitee-gateway*\n:star::star::star::star: 1528 reviews\n *version: 7.2.8*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://download.gravitee.io/logo.png",
				"alt_text": "alt text for image"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*gravitee-kubernetes*\n:star::star::star::star: 1528 reviews\n *version: 1.2.4*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://download.gravitee.io/logo.png",
				"alt_text": "alt text for image"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*gravitee-management-rest-api*\n:star::star::star::star: 1528 reviews\n *version: 5.3.4*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://download.gravitee.io/logo.png",
				"alt_text": "alt text for image"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*gravitee-management-webui*\n:star::star::star::star: 1528 reviews\n *version: 3.8.0*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://download.gravitee.io/logo.png",
				"alt_text": "alt text for image"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Approve",
						"emoji": true
					},
					"value": "click_me_123"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Disapprove",
						"emoji": true
					},
					"value": "click_me_123",
					"url": "https://google.com"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Go to Circle CI to Approve / Disappprove the Job",
						"emoji": true
					},
					"value": "click_me_123",
					"url": "https://google.com"
				}
			]
		}
	]
}
*/
