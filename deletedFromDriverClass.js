
/*
findElementFromElement (el, p) {
  return this.execute('post', `/element/${el.id}/element`, p)
}

findElementsFromElement (el, p) {
  return this.execute('post', `/element/${el.id}/elements`, p)
}

isElementSelected (el, p) {
  return this.execute('get', `/element/${el.id}/selected`, p)
}

getElementAttribute (el, name, p) {
  return this.execute('get', `/element/${el.id}/attribute/${name}`, p)
}

getElementProperty (el, name, p) {
  return this.execute('get', `/element/${el.id}/property/${name}`, p)
}

getElementCssValue (el, name, p) {
  return this.execute('get', `/element/${el.id}/css/${name}`, p)
}

getElementText (el, p) {
  return this.execute('get', `/element/${el.id}/text`, p)
}

getElementTagName (el, p) {
  return this.execute('get', `/element/${el.id}/name`, p)
}

getElementRect (el, p) {
  return this.execute('get', `/element/${el.id}/rect`, p)
}

isElementEnabled (el, p) {
  return this.execute('get', `/element/${el.id}/enabled`, p)
}

elementClick (el, p) {
  return this.execute('post', `/element/${el.id}/click`, p)
}

elementClear (el, p) {
  return this.execute('post', `/element/${el.id}/clear`, p)
}

elementSendKeys (el, p) {
  // W3c: Adding 'value' to parameters, so that Chrome works too
  p.value = p.text.split('')
  return this.execute('post', `/element/${el.id}/value`, p)
}

takeElementScreenshot (el, p) {
  return this.execute('get', `/element/${el.id}/screenshot`, p)
}

*/
