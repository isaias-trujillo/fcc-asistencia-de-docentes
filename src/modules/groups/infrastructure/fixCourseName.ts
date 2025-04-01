const upperWords = ['I', 'II', 'III', 'IV', 'V', 'NIC', 'NIF'];

const fixCourseName = (name: string) => {
    return name.toLocaleLowerCase('es-ES')
        .split(" ")
        .map(word => {
            if (upperWords.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }
            if (word.length <= 3) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

export default fixCourseName