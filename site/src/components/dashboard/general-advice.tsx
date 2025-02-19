import { Component } from 'react'
import { AppStore } from '../../pages/_app.store'
import { DashboardPageStore } from '../../pages/dashboard.store'
import SwiperComponent from 'react-id-swiper'
import Swiper from 'swiper'
import { inject, observer } from 'mobx-react'
import ExternalLinkSvg from '../../../public/icons/external-link.svg'

export enum GeneralAdviceId {
  WASH_HANDS = 'wash-hands',
  MINIMISE_CONTACT = 'minimise-contact',
  AVOID_FACE = 'avoid-face',
  BE_HYGIENIC = 'be-hygienic',
  SELF_ISOLATE = 'self-isolate'
}

interface State {
  swiper: Swiper
}

interface Props {
  appStore?: AppStore,
  pageStore?: DashboardPageStore
}

@inject('appStore', 'pageStore')
@observer
export class DashboardGeneralAdviceComponent extends Component<Props, State> {
  state: State = {
    swiper: null
  }

  onSwiperInit = (swiper: Swiper) => {
    this.setState({ swiper })
  }

  onSwiperControlClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, action: 'prev' | 'next') => {
    e.preventDefault()
    e.stopPropagation()
    switch (action) {
      case 'prev':
        this.state.swiper?.slidePrev?.()
        break
      case 'next':
        this.state.swiper?.slideNext?.()
        break
    }
  }

  render () {
    const { appStore } = this.props
    const { t } = appStore

    const swiperParams = {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      autoplay: {
        delay: 5000
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }

    return (
      <div className="general-advice">
        <div className="flex px-6 pt-6 items-center max-w-0">
          <div className="flex-1">
            <h2 className="font-bold">{t('general-advice')}</h2>
          </div>
          <div className="text-sm">
            {t('more-info')}:{' '}
            <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public" target="_blank" className="inline-flex items-center font-bold underline">
              {t('who-public-advice')}
              <ExternalLinkSvg className="h-line-sm ml-1" />
            </a>
          </div>
        </div>
        <div className="general-advice-swiper-container">
          <SwiperComponent
            getSwiper={this.onSwiperInit}
            {...swiperParams}
          >
            {
              Object.values(GeneralAdviceId)
                .map(key => {
                  const title = t(`general-advice-${key}-title`)
                  const description = t(`general-advice-${key}-description`)
                  if (!title || !description) return
                  return (
                    <div key={key}>
                      <div className="mx-16 mt-6 mb-12">
                        <h3 className="font-bold text-xl">
                          {title}
                        </h3>
                        <p>{description}</p>
                      </div>
                    </div>
                  )
                })
            }
          </SwiperComponent>
        </div>
      </div>
    )
  }
}
