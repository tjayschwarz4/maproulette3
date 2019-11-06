import React, { Component } from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'
import _get from 'lodash/get'
import parse from 'date-fns/parse'
import { ChallengeStatus, messagesByStatus }
       from  '../../../../../services/Challenge/ChallengeStatus/ChallengeStatus'
import { WidgetDataTarget, registerWidgetType }
       from '../../../../../services/Widget/Widget'
import AsManager from '../../../../../interactions/User/AsManager'
import ChallengeKeywords from '../../ChallengeKeywords/ChallengeKeywords'
import VisibilitySwitch from '../../VisibilitySwitch/VisibilitySwitch'
import QuickWidget from '../../../../QuickWidget/QuickWidget'
import messages from './Messages'

const descriptor = {
  widgetKey: 'ChallengeOverviewWidget',
  label: messages.label,
  targets: [WidgetDataTarget.challenge],
  minWidth: 3,
  defaultWidth: 4,
  defaultHeight: 7,
}

export default class ChallengeOverviewWidget extends Component {
  render() {
    const manager = AsManager(this.props.user)
    const status = _get(this.props, 'challenge.status', ChallengeStatus.none)

    const dataOriginDateText = !this.props.challenge.dataOriginDate ? null :
      this.props.intl.formatMessage(messages.dataOriginDate,
        {refreshDate: this.props.intl.formatDate(parse(this.props.challenge.lastTaskRefresh)),
         sourceDate: this.props.intl.formatDate(parse(this.props.challenge.dataOriginDate))})

    return (
      <QuickWidget {...this.props}
                  className="challenge-overview-widget"
                  widgetTitle={<FormattedMessage {...messages.title} />}>
        <div className="mr-grid mr-grid-columns-2 mr-grid-gap-2">
          <div>
            <FormattedMessage {...messages.status} />
          </div>

          <div>
            <FormattedMessage {...messagesByStatus[status]} />
          </div>

          <div>
            <FormattedMessage {...messages.visibleLabel} />
          </div>

          <div>
            {this.props.challenge.parent &&
             <VisibilitySwitch {...this.props}
                               disabled={!manager.canWriteProject(this.props.challenge.parent)} />
            }
          </div>
        </div>

        <ChallengeKeywords className="mr-py-4" challenge={this.props.challenge} />

        <div className="mr-grid mr-grid-columns-2 mr-grid-gap-2">
          <div>
            <FormattedMessage {...messages.creationDate} />
          </div>

          <div>
            {this.props.challenge.created &&
             <FormattedDate value={parse(this.props.challenge.created)}
                            year='numeric' month='long' day='2-digit' />
            }
          </div>

          <div>
            <FormattedMessage {...messages.lastModifiedDate} />
          </div>

          <div>
            {this.props.challenge.modified &&
             <FormattedDate value={parse(this.props.challenge.modified)}
                            year='numeric' month='long' day='2-digit' />
            }
          </div>

          <div title={dataOriginDateText}>
            <FormattedMessage {...messages.tasksFromDate} />
          </div>

          <div title={dataOriginDateText}>
            {this.props.challenge.dataOriginDate &&
             <FormattedDate value={parse(this.props.challenge.dataOriginDate)}
                            year='numeric' month='long' day='2-digit' />
            }
          </div>
        </div>
      </QuickWidget>
    )
  }
}

registerWidgetType(ChallengeOverviewWidget, descriptor)
