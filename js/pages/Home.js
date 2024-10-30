import { clearMainContentContainer, makeElements, $ } from '../utils.js'

export class Home {
	render() {
		clearMainContentContainer()
		$('#content-container').append(
			makeElements({ type: 'div', classNames: ['container', 'flex'] })
		)
		this.fetchUserProfile()
		this.fetchChartData()
	}
	async fetchUserProfile() {
		const token = localStorage.getItem('jwt')
		// console.log("Token exists and starts with:", token?.substring(0, 10) + "...");

		const responseJSON = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				query: `
                {
                    user {
                        email
                        lastName
                        firstName
                        attrs
                        login
                    }
                }
            `,
			}),
		})

		const response = await responseJSON.json()

		if (response && response.data && response.data.user) {
			this.displayProfile(response.data.user[0])
		} else {
			console.error('Error fetching profile data:', response.errors)
		}
	}
	async fetchChartData() {
		const token = localStorage.getItem('jwt')

		const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				query: `
                {
                    user {
                        id
                        login
                        email
                        createdAt
                        firstName
                        lastName
                        auditRatio
                        totalUp
                        totalDown
                    }
                    transaction(
                        where: {type: {_eq: "xp"}, object: {type: {_eq: "project"}}},
                        order_by: {createdAt: desc}
                    ) {
                        type
                        amount
                        createdAt
                        objectId
                    }
                    progress {
                        grade
                        createdAt
                    }
                    result {
                        grade
                        createdAt
                    }
                    object {
                        id
                        name
                        type
                    }
                    skillTransactions: transaction(
                        where: {type: {_ilike: "%skill%"}},
                        order_by: {amount: desc}
                    ) {
                        type
                        amount
                    }
                }
            `,
			}),
		})
		const data = await response.json()

		if (data && data.data) {
			this.displayCharts(data.data)
		} else {
			console.error('Error fetching chart data:', data.errors)
		}
	}
	displayProfile(user) {
		let sidebar = makeElements({
			type: 'div',
			name: 'sidebar',
			classNames: ['p-3', 'pt-5'],
			children: [
				makeElements({ type: 'h4', contents: `${user.firstName} ${user.lastName}` }),
				makeElements({
					type: 'div',
					classNames: ['data-block', 'mb-2'],
					children: [
						makeElements({
							type: 'div',
							classNames: ['data-label'],
							contents: 'Username',
						}),
						makeElements({
							type: 'div',
							classNames: ['data-value'],
							contents: `${user.login}`,
						}),
					],
				}),
				makeElements({
					type: 'div',
					classNames: ['data-block', 'mb-2'],
					children: [
						makeElements({
							type: 'div',
							classNames: ['data-label'],
							contents: 'Email',
						}),
						makeElements({
							type: 'div',
							classNames: ['data-value'],
							contents: `${user.email}`,
						}),
					],
				}),
				makeElements({
					type: 'div',
					classNames: ['data-block', 'mb-2'],
					children: [
						makeElements({
							type: 'div',
							classNames: ['data-label'],
							contents: 'Phone number',
						}),
						makeElements({
							type: 'div',
							classNames: ['data-value'],
							contents: `${user.attrs.tel}`,
						}),
					],
				}),
			],
		})
		$('#content-container>.container').append(sidebar)
	}
	displayGraph_auditRatio = (dataset) => {
		const auditRatioElements = makeElements({
			type: 'div',
			name: 'audit-ratio-graph',
			classNames: ['graph-container', 'col-md-6'],
			children: [
				makeElements({
					type: 'h3',
					contents: 'Audit ratio',
				}),
				makeElements({
					type: 'canvas',
					name: 'audit-ratio-graph-canvas',
				}),
			],
		})
		$('#charts').prepend(auditRatioElements)

		const ctx = $('#audit-ratio-graph-canvas').getContext('2d')

		new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: ['Audit xp received', 'Audit xp given'],
				datasets: [
					{
						data: [dataset.totalDown, dataset.totalUp],
						backgroundColor: [
							'rgba(176, 224, 230, 0.4)', // Powder Blue
							'rgba(152, 251, 152, 0.4)', // Pale Green
						],
						borderWidth: 1,
						hoverOffset: 4,
					},
				],
			},
		})
	}
	displayGraph_xp = (dataset1, dataset2) => {
		const points = makeElements({
			type: 'div',
			name: 'points-graph',
			classNames: ['graph-container'],
			children: [
				makeElements({
					type: 'h3',
					contents: 'XP earned by project',
				}),
				makeElements({
					type: 'canvas',
					name: 'xp-graph-canvas',
				}),
			],
		})
		$('#charts').appendChild(points)

		const dataset1WithObjectName = dataset1.map((dataset1item) => {
			const myObjectId = dataset1item.objectId
			const myObjectName = dataset2.find((item) => item.id == myObjectId).name
			return { ...dataset1item, name: myObjectName }
		})

		const ctx = $('#xp-graph-canvas').getContext('2d')
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: dataset1WithObjectName.map((item) => item.name),
				datasets: [
					{
						label: 'xp',
						data: dataset1WithObjectName.map((item) => item.amount),
						backgroundColor: [
							'rgba(255, 182, 193, 0.4)', // Light Pink
							'rgba(135, 206, 250, 0.4)', // Light Sky Blue
							'rgba(147, 112, 219, 0.4)', // Medium Purple
							'rgba(152, 251, 152, 0.4)', // Pale Green
							'rgba(221, 160, 221, 0.4)', // Plum
							'rgba(240, 230, 140, 0.4)', // Khaki
							'rgba(255, 218, 185, 0.4)', // Peach Puff
							'rgba(176, 224, 230, 0.4)', // Powder Blue
							'rgba(100, 149, 237, 0.4)', // Cornflower Blue
							'rgba(216, 191, 216, 0.4)', // Thistle
						],
						borderColor: [
							'rgba(255, 182, 193, 1)', // Light Pink
							'rgba(135, 206, 250, 1)', // Light Sky Blue
							'rgba(147, 112, 219, 1)', // Medium Purple
							'rgba(152, 251, 152, 1)', // Pale Green
							'rgba(221, 160, 221, 1)', // Plum
							'rgba(240, 230, 140, 1)', // Khaki
							'rgba(255, 218, 185, 1)', // Peach Puff
							'rgba(176, 224, 230, 1)', // Powder Blue
							'rgba(100, 149, 237, 1)', // Cornflower Blue
							'rgba(216, 191, 216, 1)', // Thistle
						],
						borderWidth: 1,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		})
	}
	displayGraph_skills = (data) => {
		const skills = makeElements({
			type: 'div',
			name: 'skills-graph',
			classNames: ['graph-container'],
			children: [
				makeElements({
					type: 'h3',
					contents: 'Skills learned',
				}),
				makeElements({
					type: 'canvas',
					name: 'skills-graph-canvas',
				}),
			],
		})

		$('#charts').appendChild(skills)

		let uniqueSkills = data.reduce((groupedSkills, item) => {
			const skill = item.type.replace('skill_', '')
			const amount = item.amount

			groupedSkills[skill] = (groupedSkills[skill] || 0) + amount
			return groupedSkills
		}, {})

		const ctx = $('#skills-graph-canvas').getContext('2d')
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: Object.keys(uniqueSkills),
				datasets: [
					{
						label: 'Amount',
						data: Object.values(uniqueSkills),
						backgroundColor: [
							'rgba(255, 182, 193, 0.4)', // Light Pink
							'rgba(135, 206, 250, 0.4)', // Light Sky Blue
							'rgba(147, 112, 219, 0.4)', // Medium Purple
							'rgba(152, 251, 152, 0.4)', // Pale Green
							'rgba(221, 160, 221, 0.4)', // Plum
							'rgba(240, 230, 140, 0.4)', // Khaki
							'rgba(255, 218, 185, 0.4)', // Peach Puff
							'rgba(176, 224, 230, 0.4)', // Powder Blue
							'rgba(100, 149, 237, 0.4)', // Cornflower Blue
							'rgba(216, 191, 216, 0.4)', // Thistle
						],
						borderColor: [
							'rgba(255, 182, 193, 1)', // Light Pink
							'rgba(135, 206, 250, 1)', // Light Sky Blue
							'rgba(147, 112, 219, 1)', // Medium Purple
							'rgba(152, 251, 152, 1)', // Pale Green
							'rgba(221, 160, 221, 1)', // Plum
							'rgba(240, 230, 140, 1)', // Khaki
							'rgba(255, 218, 185, 1)', // Peach Puff
							'rgba(176, 224, 230, 1)', // Powder Blue
							'rgba(100, 149, 237, 1)', // Cornflower Blue
							'rgba(216, 191, 216, 1)', // Thistle
						],
						borderWidth: 1,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		})
	}
	displayCharts(data) {
		let charts = makeElements({ type: 'div', name: 'charts', classNames: ['flex-1', 'row'] })
		$('#content-container>.container').prepend(charts)

		this.displayGraph_skills(data.skillTransactions)
		this.displayGraph_xp(data.transaction, data.object)
		this.displayGraph_auditRatio(data.user[0])
	}
}
