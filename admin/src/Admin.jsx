import React, { Component } from 'react'
import update from 'immutability-helper'
import 'array.prototype.move'
import logo from '../public/logo.svg'
import '../public/Admin.css'
import CategoriesHeader from './CategoriesHeader'
import ExtraFields from './ExtraFields'
div
update.extend('$move', ([a, b], arr) =>
{
  return [...arr.move(a, b)]
})

function Category(name)
{
  this.name = ''
  this.extraFields = []
}

function Field()
{
  this.name = ''
  this.type = 'text'
  this.required = false
  this.showOnEmails = false
}

const initialCategories = [
  {
    name: 'tickets',
    extraFields: [
      {
        name: 'ticket_notes',
        required: false,
        type: 'text',
        showOnEmails: false
      }
    ]
  }
]


export default class Admin extends Component
{
  constructor()
  {
    super()
    this.state = {
      currentTab: 0,
      editingCategory: false,
      categories: window.categories.length ? window.categories : initialCategories
    }
  }

  save()
  {
    jQuery.post(ajaxurl, {
      action: 'saveCheckoutFields',
      categories: this.state.categories,
    }, (res) =>
      {
        console.log(res)
      })
  }

  switchTab(index)
  {
    this.stopEditing()
    this.setState({ currentTab: index })
  }

  addCategory()
  {
    this.stopEditing()

    this.setState(
      update(this.state, {
        categories: { $push: [new Category()] },
        currentTab: { $set: this.state.categories.length },
        editingCategory: { $set: true }
      })
    )
  }

  editCategory(index)
  {
    this.stopEditing()
    this.setState({
      currentTab: index,
      editingCategory: true
    })
  }

  removeCategory(index)
  {

  }

  addField()
  {
    this.setState(
      update(this.state, { categories: { [this.state.currentTab]: { extraFields: { $push: [new Field()] } } } })
    )
  }

  moveField(indexA, indexB)
  {
    this.setState(
      update(this.state, { categories: { [this.state.currentTab]: { extraFields: { $move: [indexA, indexB] } } } })
    )
  }

  removeField(index)
  {
    this.setState(
      update(this.state, { categories: { [this.state.currentTab]: { extraFields: { $splice: [[index, 1]] } } } })
    )
  }

  updateField(index, key, value)
  {
    this.setState(update(this.state, {
      categories: { [this.state.currentTab]: { extraFields: { [index]: { [key]: { $set: value } } } } }
    }))
  }

  updateName(name)
  {
    console.log(this.__proto__)

    const categories = this.state.categories
    const category = categories[this.state.currentTab]
    category.name = name
    categories[this.state.currentTab] = category

    this.setState({
      categories
    })
  }


  stopEditing()
  {
    this.setState({
      editingCategory: false,
      categories: this.filterEmptyCategories(this.state.categories)
    })
  }

  filterEmptyCategories(categories)
  {
    console.log(arguments)
    return categories.filter(c => c.name != '')
  }

  render()
  {
    return (
      <div id="admin">
        <CategoriesHeader
          editingCategory={this.state.editingCategory}
          categories={this.state.categories}
          addCategory={this.addCategory.bind(this)}
          toggleEditing={this.editCategory.bind(this)}
          currentTab={this.state.currentTab}
          updateName={this.updateName.bind(this)}
          stopEditing={this.stopEditing.bind(this)}
          switchTab={this.switchTab.bind(this)}
          save={this.save.bind(this)}
          />
        <ExtraFields
          fields={this.state.categories[this.state.currentTab].extraFields}
          addField={this.addField.bind(this)}
          stopEditing={this.stopEditing.bind(this)}
          updateField={this.updateField.bind(this)}
          moveField={this.moveField.bind(this)}
          removeField={this.removeField.bind(this)}
          />
      </div>
    )
  }
}
