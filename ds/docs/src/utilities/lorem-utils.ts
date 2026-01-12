import { en, Faker } from '@faker-js/faker'
import { capitalize } from 'lodash'

let _faker = new Faker({ locale: en })

// Seed
export const setRandomSeed = (seed: number) => _faker.seed(seed)
export const resetRandomSeed = () => (_faker = new Faker({ locale: en }))

// Number
let _loremId = 1001
export const loremId = () => _loremId++
export const loremInt = (min: number, max: number) => _faker.number.int({ min, max })
export const loremFloat = (min: number, max: number) => _faker.number.float({ min, max, fractionDigits: 2 })

// Boolean
export const loremBool = () => _faker.datatype.boolean()
export const loremTrue = () => loremInt(1, 5) > 1 // 80% chance to be true
export const loremFalse = () => loremInt(1, 5) === 1 // 80% chance to be false

// Array
export const loremArray = (min: number, max?: number) => Array.from(Array(loremInt(min, max || min)))
export const loremFromArray = <T = any>(array: T[]) => array[loremInt(0, array.length - 1)]

// String
export const loremText = (words: number = 5) => capitalize(_faker.lorem.words(words))
export const loremLongText = (sentences: number = 5) => _faker.lorem.sentences(sentences)

// Date
export const loremRecentDate = () => _faker.date.recent().toISOString()

// Images
export const loremAvatar = () => _faker.image.url({ width: 512, height: 512 }) + '.jpg'
export const loremImageHD = () => _faker.image.url({ width: 1280, height: 720 }) + '.jpg'
export const loremImageFHD = () => _faker.image.url({ width: 1920, height: 1080 }) + '.jpg'

// Names
export const loremFirstName = () => _faker.person.firstName()
export const loremLastName = () => _faker.person.lastName()
export const loremFullName = () => `${_faker.person.firstName()} ${_faker.person.lastName()}`
