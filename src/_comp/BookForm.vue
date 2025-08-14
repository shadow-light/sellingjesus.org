
<template lang="pug">

div.success(v-if='success')
    p
        strong Your order has been received and will soon be on its way.
    p Delivery usually takes 1-2 weeks, depending on your country.
    p If you haven't received the book within that time, please do contact us.
    div.done
        VPButton(text="Done" @click='done')

form(v-else ref='form' :class='{attempted}')

    h3 Order free copy

    p If you would like a printed copy rather than an ebook, we're happy to pay for the printing and shipping for you. This offer is open to anyone, no questions ask. If you need more than one copy, please #[a(href='/about#contact') contact us].

    p Your contact information is required in case there are issues with delivery and will be passed on to our printing and shipping services. It will not be used for any other purpose than delivering the book to you.
    p The book will usually arrive within 1 week for Western countries, but may take up to 3-4 weeks for others.

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
            option(value='' disabled) Select...
            option(value='US') United States
            option(value='GB') United Kingdom
            option(value='CA') Canada
            option(value='AU') Australia
            option(value='NZ') New Zealand
            option(value='' disabled) ---
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
            label(for='form_state') State/Province
            select(v-if='states' id='form_state' v-model='input_state' required)
                option(v-for='state of states' :value='state.code') {{ state.name }}
            input(v-else id='form_state' type='text' v-model='input_state')

        div.postcode
            label(for='form_postcode') Zip/Postcode
            input(id='form_postcode' type='text' v-model='input_postcode' required)

    div.other(v-if='show_tax_id')
        label(for='form_tax_id') Tax ID (optional)
        input(id='form_tax_id' type='text' v-model='input_tax_id'
            placeholder="Only if your country requires it")

    div.turnstile

    div.submit
        div
            VPButton(@click='submit' type='button' :disabled='progress'
                :text='progress ? "Sending..." : "Submit order"')
        div(v-if='error').error
            p {{ error }}
            p Email us at info@sellingjesus.org if you need any help



</template>


<script lang="ts" setup>

import {computed, nextTick, onMounted, ref} from 'vue'

import countries from './regions.json'


declare global {
    interface Window {
        turnstile:any
    }
}


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
const input_turnstile = ref('')


function reset(){

    // Reset input
    input_name.value = ''
    input_email.value = ''
    input_country.value = ''
    input_city.value = ''
    input_postcode.value = ''
    input_street1.value = ''
    input_phone.value = ''
    input_state.value = ''
    input_street2.value = ''
    input_tax_id.value = ''

    // Reset state
    attempted.value = false
    error.value = null
    success.value = false

    // Re-render turnstile (after DOM restored)
    nextTick(() => {
        input_turnstile.value = ''
        render_turnstile()
    })
}


// Whether tax_id may be relevant
const show_tax_id = computed(() => {
    // These English speaking countries are commonly sent to and do NOT require it, so hide it
    return input_country.value && !['AU', 'US', 'GB', 'CA', 'NZ'].includes(input_country.value)
})


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
    error.value = null

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
        turnstile: input_turnstile.value,
        name: input_name.value,
        email: input_email.value,
        address_country: input_country.value,
        address_city: input_city.value,
        address_postcode: input_postcode.value,
        address_street1: input_street1.value,
        address_phone: input_phone.value,
        address_state: input_state.value,
        address_street2: input_street2.value,
        // NOTE In case previously filled but no longer shown
        address_tax_id: show_tax_id.value ? input_tax_id.value : '',
    }

    // Determine functions URL
    const url = import.meta.env.DEV ? 'http://127.0.0.1:5001/copy-church/us-west1/record_order'
        : 'https://record-order-eyjvbqmvpa-uw.a.run.app'

    // Send request
    progress.value = true
    let resp:Response
    try {
        resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (caught){
        progress.value = false
        console.error(caught)
        error.value = "Couldn't connect, please try again"
        return
    }

    // Handle function failure
    if (!resp.ok){
        progress.value = false
        console.error(resp.status + ' ' + resp.statusText)
        error.value = "Something went wrong, please contact us instead: info@sellingjesus.org"
        return
    }

    // Try read JSON body
    let resp_error:string|null
    try {
        resp_error = (await resp.json()).error
    } catch {
        progress.value = false
        console.error("Couldn't read JSON body")
        error.value = "Something went wrong, please contact us instead: info@sellingjesus.org"
        return
    }

    // Determine result
    if (resp_error){
        error.value = resp_error
        // If a Turnstile error, need to reset so user can try again
        if (resp_error.includes('human')){
            input_turnstile.value = ''
            self.turnstile.reset()
        }
    } else {
        success.value = true
    }
    progress.value = false
}


const done = () => {
    reset()
}


// Function for ensuring turnstile has been loaded
async function load_turnstile(){
    return new Promise<void>((resolve, reject) => {

        // Check if aleady exists
        if (self.turnstile)
            return resolve()
        const existing = document.querySelector('script[src*="turnstile"]')
        if (existing){
            existing.addEventListener('load', () => resolve())
            return
        }

        // Add script
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Failed to load Turnstile"))
        document.head.appendChild(script)
    })
}


// Render turnstile at div with class 'turnstile'
async function render_turnstile(){
    self.turnstile.render('.turnstile', {
        sitekey: '0x4AAAAAABoYqRsX2W9RrFK4',
        callback: function(token:string){
            input_turnstile.value = token
        },
    })
}


onMounted(async () => {
    await load_turnstile()
    render_turnstile()
})


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

.success
    text-align: center

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

.submit button[disabled]
    animation: 1s infinite linear progress
    background-color: transparent !important
    background: linear-gradient(90deg, #3333, #ccc3, #3333, #ccc3, #3333)
    background-size: 200% 100%

@keyframes progress
    0%
        background-position: 0% 50%
    100%
        background-position: 100% 50%

</style>
