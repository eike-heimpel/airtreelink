
let mockCardData = {
    1: { id: 1, content: 'Card 1', lastChanged: "2024-05-27T08:54:55.251Z" },
    2: { id: 2, content: 'Card 2', lastChanged: "2024-05-27T08:54:55.251Z" },
    3: { id: 3, content: 'Card 2', lastChanged: "2024-05-27T08:59:55.251Z" },
    4: { id: 4, content: 'Card 2', lastChanged: "2024-05-27T10:10:55.251Z" },

}

export const load = async ({ request, cookies }) => {

    const lastUpdated = cookies.get('lastUpdated');

    console.log(lastUpdated)

    let modifiedCards = []

    if (!lastUpdated) {
        modifiedCards = Object.values(mockCardData);
    } else {
        modifiedCards = Object.values(mockCardData).filter(card => new Date(card.lastChanged) > new Date(lastUpdated));
    }
    console.log(modifiedCards)

    cookies.set('lastUpdated', new Date().toISOString(), { path: '/' });

    return { modifiedCards, lastChanged: new Date().toISOString() };

};
