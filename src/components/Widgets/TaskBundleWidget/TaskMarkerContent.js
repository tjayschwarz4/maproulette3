import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import _isFinite from 'lodash/isFinite'
import { messagesByStatus } from '../../../services/Task/TaskStatus/TaskStatus'
import { messagesByPriority } from '../../../services/Task/TaskPriority/TaskPriority'
import { TaskReviewStatus } from '../../../services/Task/TaskReview/TaskReviewStatus'
import AsCooperativeWork from '../../../interactions/Task/AsCooperativeWork'
import messages from './Messages'

/**
 * The content to show in the popup when a task marker is clicked.
 */
class TaskMarkerContent extends Component {
  toggleSelection = () => {
    this.props.toggleTaskSelection(this.props.marker.options)
  }

  render() {
    const bundle = this.props.taskBundleData?.map((bundleObject) => bundleObject.id) || []
    const selected = this.props.isTaskSelected(this.props.marker.options.taskId)

    const checkBoxEnabled =
      !this.props.bundling &&
      this.props.marker.options.taskId !== this.props.task.id &&
      !(this.props.workspace.name === 'taskReview') &&
      (this.props.marker.options.status === 0 || this.props.marker.options.status === 3 || 
      this.props.marker.options.taskStatus === 0 || this.props.marker.options.taskStatus === 3) &&
      !AsCooperativeWork(this.props.task).isTagType() && !this.props.taskReadOnly

    const notActive =
      this.props.taskReadOnly ||
      (!this.props.task?.reviewStatus && !(this.props.task?.reviewStatus === 0) && 
      !(this.props.task?.status  === 0 || this.props.task?.status  === 3)) ||
      (this.props.task?.reviewStatus === TaskReviewStatus.needed &&
      (!(this.props.workspace.name === "taskReview") || this.props.task?.reviewClaimedBy !== this.props.user.id))

    const statusMessage = messagesByStatus[
      _isFinite(this.props.marker.options.taskStatus)
        ? this.props.marker.options.taskStatus
        : this.props.marker.options.status
    ]
    
    const priorityMessage = messagesByPriority[
      _isFinite(this.props.marker.options.taskPriority)
        ? this.props.marker.options.taskPriority
        : this.props.marker.options.priority
    ]

    const taskId = this.props.marker.options.taskId ?? this.props.marker.options.id
    const bundlePrimary = this.props.taskBundle?.tasks.find(task => task.isBundlePrimary === true)

    return (
      <div className="mr-flex mr-justify-center">
        <div className="mr-flex-col mr-w-full">
          {[
            ['nameLabel', this.props.marker.options.name],
            ['taskIdLabel', taskId],
            ['statusLabel', statusMessage && this.props.intl.formatMessage(statusMessage)],
            ['priorityLabel', priorityMessage && this.props.intl.formatMessage(priorityMessage)],
          ].map(([labelMessageId, content]) => (
            <div key={labelMessageId} className="mr-flex">
              <div className="mr-w-1/2 mr-mr-2 mr-text-right">
                <FormattedMessage {...messages[labelMessageId]} />
              </div>
              <div className="mr-w-1/2 mr-text-left">{content}</div>
            </div>
          ))}

          <div className="mr-flex mr-justify-center mr-mt-2">
            <label>
              {checkBoxEnabled ? (
                <input
                  type="checkbox"
                  className="mr-mr-1"
                  checked={selected}
                  onChange={this.toggleSelection}
                />
              ) : !this.props.bundling && !this.props.marker.options.bundleId && this.props.marker.options.taskId === this.props.task.id ? (
                <span className="mr-mr-1">✓</span>
              ) : !this.props.bundling ? <span className="mr-mr-1"><FormattedMessage {...messages.unableToSelect} /></span> : null}

              {!this.props.bundling && !this.props.marker.options.bundleId && (checkBoxEnabled || this.props.marker.options.taskId === this.props.task.id) && (
                <span>
                  <FormattedMessage {...messages.selectedLabel} />
                  {this.props.marker.options.taskId === this.props.task.id && (
                    <span className="mr-ml-1">
                      <FormattedMessage {...messages.currentTask} />
                    </span>
                  )}
                </span>
              )}

              {this.props.bundling ? (
                <div>
                  {bundlePrimary?.id === taskId || (!bundlePrimary && taskId === this.props.task?.id) ? (
                    <FormattedMessage {...messages.cannotEditPrimaryTask} />
                  ) : this.props.bundling && bundle.includes(taskId) ? (
                    <button
                      disabled={notActive}
                      onClick={() => this.props.unbundleTask(this.props.marker.options)}
                      className="mr-text-red mr-border-solid mr-border mr-border-red mr-px-2 mr-mb-1"
                      style={{
                        cursor: notActive ? 'default' : 'pointer',
                        opacity: notActive ? 0.3 : 1,
                      }}
                    >
                      <FormattedMessage {...messages.removeFromBundle} />
                    </button>
                  ) : null}
                </div>
              ) : null}

            </label>
          </div>
        </div>
      </div>
    )
  }
}

export default TaskMarkerContent
