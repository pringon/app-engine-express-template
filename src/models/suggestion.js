import { addDoc, collection, query, getDocs, orderBy } from 'firebase/firestore/lite';

export function makeModel(db) {
    const model = initBackend(db)
    model.methods = makeMethods(model)
    return Object.freeze(model)
}

function initBackend(db) {
    if (db.backend === "mem") {
        return {
            backend: "mem",
            data: []
        }
    } else if (db.backend === "firebase") {
        return {
            backend: "firebase",
            driver: collection(db.driver, 'suggestions')
        }
    }
}

function makeMethods(model) {
    return {
        addSuggestion: async (suggestion) => {
            if (model.backend === "mem") {
                suggestion.id = model.data.length
                model.data.push(suggestion)
                return suggestion
            } else if (model.backend === "firebase") {
                return await addDoc(model.driver, suggestion)
            }
            throw Error(`Unsupported backend: ${model.backend}`)
        },
        getSuggestions: async () => {
            if (model.backend === "mem") {
                return model.data
            } else if (model.backend === "firebase") {
                const q = query(model.driver, orderBy('name', 'asc'))
                const entities = await getDocs(q)
                return entities.docs.map(doc => doc.data())
            }
            throw Error(`Unsupported backend: ${model.backend}`)
        }
    }
}
