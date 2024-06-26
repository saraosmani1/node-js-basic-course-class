const verifyToken = async (jwt) => {
    try {
        const response = await fetch("http://127.0.0.1:3001/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: jwt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error verifying token:", error);
    }
};
