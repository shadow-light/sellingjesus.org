
<template lang="pug">

div.form

    h3 Order free copy

    p Your contact information is required in case there are issues with delivery and will be passed on to our printing and shipping services. It will not be used for any other purpose than delivering the book to you.

    div.contact
        label(for='form_name') Name
        input(id='form_name' type='text' required)
        label(for='form_email') Email address
        input(id='form_email' type='email' required)
        label(for='form_phone') Phone number
        //- NOTE pattern comes from Lulu but allows whitespace at start (end already allowed)
        input(id='form_phone' type='tel' pattern="^\\s*\\+?[\\d\\s\\-.\\/\\(\\)]{8,20}$")

    div.street
        label(for='form_country') Country
        select(id='form_country' v-model='input_country')
            option(v-for='country of countries' :value='country.code') {{ country.name }}
        label(for='form_street1') Street address
        input(id='form_street1' type='text')
        label(for='form_street2')
        input(id='form_street2' type='text')

    div.region

        div.city
            label(for='form_city') City/Suburb
            input(id='form_city' type='text')

        div.state
            label(for='form_state') State/Region
            select(v-if='states' id='form_state' v-model='input_state')
                option(v-for='state of states' :value='state.code') {{ state.name }}
            input(v-else id='form_state' type='text')

        div.postcode
            label(for='form_postcode') Zip/Postcode
            input(id='form_postcode' type='text')

    div.other
        label(for='form_tax_id') Tax ID (optional)
        input(id='form_tax_id' type='text' placeholder="Only if your country requires it")

    div.submit
        VPButton(text="Submit order")


</template>


<script lang="ts" setup>

import {computed, ref} from 'vue'

import countries from './regions.json'


const input_country = ref()
const input_state = ref()


const states = computed(() => {
    if (!input_country.value){
        return
    }
    const regions = countries.find(c => c.code === input_country.value)!.regions
    return regions.length ? regions : undefined
})

</script>


<style lang="sass" scoped>

.form
    border-radius: 12px
    padding: 24px
    margin: 24px 0
    background-color: #8882

    h3
        margin-top: 0

.contact, .street, .region, .other
    margin: 36px 0
    display: grid
    align-items: center
    grid-template-columns: 1fr
    gap: 12px
    @media (min-width: 800px)
        grid-template-columns: auto 1fr

.region
    display: flex
    @media (max-width: 800px)
        flex-direction: column
        align-items: flex-start

    > div
        display: flex
        flex-direction: column
        gap: 12px

        label
            margin-left: 8px

    .city
        flex-grow: 1
        width: 100%
        max-width: 300px
    .postcode
        max-width: 200px

label
    font-weight: bold
    font-size: 0.8em
    line-height: 1
    min-width: 150px

input, select
    background-color: #8882
    border-radius: 6px
    width: 100%
    max-width: 400px
    padding: 12px
    font-size: 16px
    line-height: 1

    &:focus
        background-color: #8886

    &::placeholder
        color: #888

    &:invalid
        color: red

select
    width: 300px

    option
        background-color: white
        color: black

.submit
    margin-top: 24px
    text-align: center

</style>
