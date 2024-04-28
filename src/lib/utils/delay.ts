/* a simple delay function for testing purposes */
const delay = async (ms: number = 1000) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default delay;