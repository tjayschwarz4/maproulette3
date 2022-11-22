import React, { Component } from 'react'
import queryString from 'query-string'

/**
 * Deals with superadmin query routes for super admin metrics.
 * Toggle filter logic here as well.
 */
const WithMetricsFilter = function(WrappedComponent) {
  return class extends Component {
    render() {
      const params = queryString.parse(this.props.location.search)
      const tab = params['tab']
      let entityFilters = {
        visible: params['hideUndiscoverable'] === 'true',
        archived: params['hideArchived'] === 'true',
        virtual: params['virtual'] === 'true'
      }

      const toggleFilter = (filterName) => {
        entityFilters[filterName] = !entityFilters[filterName]
        let searchquery = `?`
        searchquery += `tab=${tab}&`
        searchquery += `hideUndiscoverable=${entityFilters.visible}&`
        searchquery += `hideArchived=${entityFilters.archived}&`
        searchquery += `virtual=${entityFilters.virtual}`
        this.props.history.push({
          pathname: '/superadmin',
          search: searchquery
        })  
      }
      let challenges = this.props.challenges
      let projects = this.props.projects
      if (tab === 'challenges') {
        challenges = entityFilters.visible ? this.props.challenges.filter(c => c.enabled) : this.props.challenges
        challenges = entityFilters.archived ? challenges.filter(c => !c.isArchived) : challenges
      }
      else if (tab === 'projects') {
        projects = entityFilters.visible ? this.props.projects.filter(p => p.enabled) : this.props.projects
        projects = entityFilters.archived ? projects.filter(p => !p.isArchived) : projects
        projects = entityFilters.virtual ? projects.filter(p => p.isVirtual) : projects
      }
      return (
        <WrappedComponent {...this.props} 
          challenges = {challenges} 
          projects={projects}
          entityFilters = {entityFilters}
          toggleFilter = {toggleFilter}
        />
      )
    }
  }
}

export default (WrappedComponent) => WithMetricsFilter(WrappedComponent)