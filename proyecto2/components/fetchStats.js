const fetchStats = async (sessionToken) => {
    let result = await fetch('https://moviles-proyecto2.herokuapp.com/users/userStats', {
        method: 'GET',
        headers: {
            'authToken': sessionToken
        }
    });
    let json = await result.json();
    return [json.content.created_tasks, json.content.completed_tasks, json.content.current_tasks, json.content.pinned_tasks];
}

export { fetchStats }