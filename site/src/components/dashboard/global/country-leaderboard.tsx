import { PureComponent } from 'react'
import { observer, inject } from 'mobx-react'
import { DashboardPageStore, Place } from '../../../pages/dashboard.store'
import get from 'lodash.get'
import numeral from 'numeral'
import { AppStore } from '../../../pages/_app.store'
import { SelectInputComponent } from '../../inputs/select'

interface Props {
  appStore?: AppStore
  pageStore?: DashboardPageStore
}

enum LeaderboardTypeId {
  MOST_CASES = 'mostCases',
  MOST_CASES_AS_PERCENTAGE_OF_POPULATION = 'mostCasesAsPercentageOfPopulation',
  MOST_DEATHS = 'mostDeaths',
  MOST_DEATHS_AS_PERCENTAGE_OF_POPULATION = 'mostDeathsAsPercentageOfPopulation',
  HIGHEST_DEATH_RATE = 'highestDeathRate',
  LOWEST_DEATH_RATE = 'lowestDeathRate',
  HIGHEST_RECOVERY_RATE = 'highestRecoveryRate',
  LOWEST_RECOVERY_RATE = 'lowestRecoveryRate'
}

interface LeaderboardType {
  id: LeaderboardTypeId
  labelI18n: string
  accessor: string
  sortBy?: 'desc' | 'asc'
  formatter?: (value: number) => string
  filter?: (place: Place) => boolean
}

const leaderboardTypes: LeaderboardType[] = [{
  id: LeaderboardTypeId.MOST_CASES,
  labelI18n: 'most-cases',
  accessor: 'latestData.cases',
  formatter: (value: number) => numeral(value).format(value >= 1000 ? '0.[0]a' : '0,0')
}, {
  id: LeaderboardTypeId.MOST_CASES_AS_PERCENTAGE_OF_POPULATION,
  labelI18n: 'most-cases-perc-population',
  accessor: 'latestData.casesAsPercentageOfPopulation',
  formatter: (value: number) => numeral(value).format('0.000%')
}, {
  id: LeaderboardTypeId.MOST_DEATHS,
  labelI18n: 'most-deaths',
  accessor: 'latestData.deaths',
  formatter: (value: number) => numeral(value).format(value >= 1000 ? '0.[0]a' : '0,0')
}, {
  id: LeaderboardTypeId.MOST_DEATHS_AS_PERCENTAGE_OF_POPULATION,
  labelI18n: 'most-deaths-perc-population',
  accessor: 'latestData.deathsAsPercentageOfPopulation',
  formatter: (value: number) => numeral(value).format('0.000%')
}, {
  id: LeaderboardTypeId.HIGHEST_DEATH_RATE,
  labelI18n: 'highest-death-rate',
  accessor: 'latestData.deathRate',
  formatter: (value: number) => numeral(value).format('0.000%'),
  filter: (place: Place) => isFinite(place.latestData.deathRate)
}, {
  id: LeaderboardTypeId.LOWEST_DEATH_RATE,
  labelI18n: 'lowest-death-rate',
  accessor: 'latestData.deathRate',
  sortBy: 'asc',
  formatter: (value: number) => numeral(value).format('0.000%'),
  filter: (place: Place) => place.latestData.deathRate > 0
}, {
  id: LeaderboardTypeId.HIGHEST_RECOVERY_RATE,
  labelI18n: 'highest-recovery-rate',
  accessor: 'latestData.recoveryRate',
  formatter: (value: number) => numeral(value).format('0.000%'),
  filter: (place: Place) => isFinite(place.latestData.deathRate)
}, {
  id: LeaderboardTypeId.LOWEST_RECOVERY_RATE,
  labelI18n: 'lowest-recovery-rate',
  accessor: 'latestData.recoveryRate',
  sortBy: 'asc',
  formatter: (value: number) => numeral(value).format('0.000%'),
  filter: (place: Place) => place.latestData.recoveryRate > 0
}]

interface State {
  leaderboardTypeId?: LeaderboardTypeId
  data?: any
}

@inject('appStore', 'pageStore')
@observer
export class DashboardGlobalCountryLeaderboardComponent extends PureComponent<Props, State> {
  state: State = {
    leaderboardTypeId: LeaderboardTypeId.MOST_CASES
  }

  render () {
    const { appStore, pageStore } = this.props
    const { t } = appStore

    const leaderboardType = leaderboardTypes.find(({ id }) => id === this.state.leaderboardTypeId)

    const leaderboardTypeSelect = (
      <SelectInputComponent
        selectedItem={leaderboardType}
        options={leaderboardTypes}
        onChange={(leaderboardType: LeaderboardType) => this.setState({ leaderboardTypeId: leaderboardType.id })}
        itemToString={(leaderboardType: LeaderboardType) => leaderboardType?.labelI18n ? t(leaderboardType.labelI18n) : null}
        buttonClassName="btn btn-white flex items-center border border-light rounded-sm px-2 py-1 text-lg font-bold"
      />
    )

    return (
      <div className="dashboard-panel flex flex-col select-none">
        <div className="flex flex-col md:flex-row md:items-center mb-2">
          <div className="flex-shrink-0">
            {leaderboardTypeSelect}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-scroll scrolling-touch">
          {(() => {
            const { accessor, formatter, filter, sortBy } = leaderboardType

            let places = [...pageStore.countries.data]

            if (typeof filter === 'function') places = places.filter(filter)

            places = places.sort((a, b) => get(a, accessor) - get(b, accessor))

            if (sortBy !== 'asc') places.reverse()

            return places
              .slice(0,30)
              .map((place) => {
                return (
                  <div key={place.id} className="flex flex-row min-w-0">
                    <div className="flex flex-1 items-center font-bold">
                      {
                        place.alpha2code
                          ? <img src={`/flags/${place.alpha2code.toLowerCase()}.svg`} className="h-line mr-2" />
                          : ''
                      }
                      <span className="truncate">
                        {place.name}
                      </span>
                    </div>
                    <div className="flex flex-1 justify-end ">
                      <span className="font-bold text-lg">{formatter(get(place, accessor))}</span>
                    </div>
                  </div>
                )
              })
          })()}
        </div>
      </div>
    )
  }
}
