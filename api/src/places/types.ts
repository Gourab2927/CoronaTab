
import { Router } from 'express'
import 'express-async-errors'
import { Requests } from '../utils/requests'
import { PlaceType, PlaceTypes } from '@coronatab/data'
import { LocaleId } from '@coronatab/shared'
import { CoronaTabRequest } from '../api'
const types = Router()

const SerializePlaceType = (type: PlaceType, { locale }: { locale: LocaleId }) => {
  type = JSON.parse(JSON.stringify(type))
  type.name = type.locales[locale] ?? type.locales.en
  delete type.locales
  return type
}

types.get('/', (req: CoronaTabRequest, res) => {
  const { locale } = req
  return res.json({
    data: PlaceTypes.map(type => SerializePlaceType(type, { locale }))
  })
})

export { types }
