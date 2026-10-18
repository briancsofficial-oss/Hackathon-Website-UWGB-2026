export const displayMonths = (months: string[]) => {
    const mons: {label: string, value: string}[] = [];

    months.forEach(month => {
        mons.push({
            label: month,
            value: month.toLowerCase()
        })
    })

    return mons
}