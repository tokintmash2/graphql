export async function fetchUserProfile() {
    const token = localStorage.getItem('jwt');
    console.log("Token exists and starts with:", token?.substring(0, 10) + "...");



    const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                {
                    user {
                        email
                        lastName
                        firstName
                        attrs
                    }
                }
            `
        })
    });

    const data = await response.json();
    console.log('Response data:', data);

    if (data && data.data && data.data.user) {
        displayProfile(data.data.user[0]);
    } else {
        console.error('Error fetching profile data:', data.errors);
    }
}

export async function fetchChartData() {
    const token = localStorage.getItem('jwt');

    const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
            `
        })
    });
    const data = await response.json();

    if (data && data.data) {
        console.log('Chart data received:', data.data);
    } else {
        console.error('Error fetching chart data:', data.errors);
    }
}

// export async function fetchUserProfile() {
//     console.log('Fetching user profile...');
//     const token = localStorage.getItem('jwt');
//     const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//             query: `
//             {
//               user {
//                 id
//                 login
//               }
//             }
//             `
//         })
//     });

//     const result = await response.json();
//     console.log(result.data);
// }

// export function LogOutProfile() {
//     window.location.href = './index.html';
//     localStorage.removeItem('jwt');
// }