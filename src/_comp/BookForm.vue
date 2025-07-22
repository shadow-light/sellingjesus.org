
<template lang="pug">

div.success(v-if='success')
    p Your order has been received.
    div.done
        VPButton(text="Done" @click='done')

form(v-else ref='form' :class='{attempted}')

    h3 Order free copy

    p Your contact information is required in case there are issues with delivery and will be passed on to our printing and shipping services. It will not be used for any other purpose than delivering the book to you.

    div.contact
        label(for='form_name') Name
        input(id='form_name' type='text' required v-model='input_name')
        label(for='form_email') Email address
        input(id='form_email' type='email' required v-model='input_email')
        label(for='form_phone') Phone number
        //- NOTE pattern comes from Lulu but allows whitespace at start (end already allowed)
        input(id='form_phone' type='tel' v-model='input_phone' required
            pattern="^\\s*\\+?[\\d\\s\\-.\\/\\(\\)]{8,20}$")

    div.street
        label(for='form_country') Country
        select(id='form_country' v-model='input_country' required)
            option(v-for='country of countries' :value='country.code') {{ country.name }}
        label(for='form_street1') Street address
        input(id='form_street1' type='text' v-model='input_street1' required)
        label(for='form_street2')
        input(id='form_street2' type='text' v-model='input_street2' placeholder="(optional)")

    div.region

        div.city
            label(for='form_city') City/Suburb
            input(id='form_city' type='text' v-model='input_city' required)

        div.state
            label(for='form_state') State/Region
            select(v-if='states' id='form_state' v-model='input_state' required)
                option(v-for='state of states' :value='state.code') {{ state.name }}
            input(v-else id='form_state' type='text' v-model='input_state')

        div.postcode
            label(for='form_postcode') Zip/Postcode
            input(id='form_postcode' type='text' v-model='input_postcode' required)

    div.other
        label(for='form_tax_id') Tax ID (optional)
        input(id='form_tax_id' type='text' v-model='input_tax_id'
            placeholder="Only if your country requires it")

    div.paper
        input(id='form_color_white' type='radio' value='white' name='color' v-model='input_color')
        label(for='form_color_white') White paper
        input(id='form_color_cream' type='radio' value='cream' name='color' v-model='input_color')
        label(for='form_color_cream') Cream paper

    div.submit
        div
            VPButton(text="Submit order" @click='submit' type='button' :disabled='progress')
        div.error {{ error }}



</template>


<script lang="ts" setup>

import {computed, ref} from 'vue'

import countries from './regions.json'


const form = ref<HTMLFormElement>()
const attempted = ref(false)
const progress = ref(false)
const error = ref<null|string>(null)
const success = ref(false)

// Input
const input_name = ref('')
const input_email = ref('')
const input_country = ref('')
const input_city = ref('')
const input_postcode = ref('')
const input_street1 = ref('')
const input_phone = ref('')
const input_state = ref('')
const input_street2 = ref('')
const input_tax_id = ref('')
const input_color = ref('white')


const states = computed(() => {
    if (!input_country.value){
        return
    }
    const regions = countries.find(c => c.code === input_country.value)!.regions
    return regions.length ? regions : undefined
})

const submit = async () => {

    // Show errors after first attempt
    attempted.value = true

    // Trim everything and see if still valid (have to when sending data anyway)
    input_name.value = input_name.value.trim()
    input_email.value = input_email.value.trim()
    // input_country.value = input_country.value.trim()
    input_city.value = input_city.value.trim()
    input_postcode.value = input_postcode.value.trim()
    input_street1.value = input_street1.value.trim()
    input_phone.value = input_phone.value.trim()
    input_state.value = input_state.value.trim()
    input_street2.value = input_street2.value.trim()
    input_tax_id.value = input_tax_id.value.trim()

    // If form not valid, abort
    if (! form.value?.checkValidity()){
        return
    }

    // Prepare data to send
    const data = {
        name: input_name.value,
        email: input_email.value,
        color: input_color.value,
        address_country: input_country.value,
        address_city: input_city.value,
        address_postcode: input_postcode.value,
        address_street1: input_street1.value,
        address_phone: input_phone.value,
        address_state: input_state.value,
        address_street2: input_street2.value,
        address_tax_id: input_tax_id.value,
    }

    // Reset progress state
    progress.value = true
    error.value = null
    try {
        const url = 'http://127.0.0.1:5001/copy-church/us-west1/record_order'
        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const resp_error = (await resp.json()).error
        if (resp.ok && !resp_error){
            success.value = true
        } else {
            error.value = resp_error || "Something went wrong"
        }
    } catch (caught){
        console.error(caught)
        error.value = "Could not connect, please try again"
    } finally {
        progress.value = false
    }
}

const done = () => {
    success.value = false
    // Reset form in case want another submission
    form.value!.reset()
    attempted.value = false
}

</script>


<style lang="sass" scoped>

form, .success
    font-family: var(--vp-font-family-base)
    font-size: 16px
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
    line-height: 1
    min-width: 150px
    cursor: pointer

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

.paper
    display: flex
    justify-content: flex-start

    input
        width: auto
        margin-right: 8px
        cursor: pointer

    label
        min-width: 0
        margin-right: 18px

.attempted
    input:invalid, select:invalid
        background-color: hsl(0, 75%, 50%, 0.2)

select
    width: 300px

    option
        background-color: white
        color: black

.submit, .done
    margin-top: 24px
    text-align: center

.error
    color: hsl(0, 50%, 60%)

</style>
