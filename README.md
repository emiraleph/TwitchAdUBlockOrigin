<img alt="GitHub followers" src="https://img.shields.io/github/followers/emiraleph?style=social"> <img alt="GitHub" src="https://img.shields.io/github/license/emiraleph/TwitchAdUBlockOrigin?color=%23FF0000&label=License&logo=license"> [![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/pixeltris/TwitchAdSolutions?color=%2300FF00&label=Original%20Project&logo=github)](https://github.com/pixeltris/TwitchAdSolutions) 
# ENGLISH
# Local Ad Blocker for Twitch <img src="uBOTwitch.png" align="right" width="128px"/>


This project is an local ad blocker for Twitch that has been modified from another project. The modified version is designed to provide an ad-free browsing experience locally and with enhanced privacy. Unlike other ad blockers, this one specifically targets Twitch and does not affect other web pages.
Enjoy your favorite Twitch streams without annoying ads and have greater control over your privacy.

## Features

- No external connections: The ad blocker works locally within your browser and does not make any external connections.
- No additional codes or encrypted links: The project is transparent and does not contain any additional codes or encrypted links.
- Open source: The source code is openly available, allowing you to contribute or make modifications according to your needs.
- Compatible with Firefox and LibreWolf: The ad blocker is compatible with Firefox and LibreWolf browsers.

## Mandatory Requirements

- Install [uBlock Origin](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin) from the official site.
- Enable in the section my filters the rule that activates the blocking of twitch ads:
- Just copy and paste the key into the ublock origin console.
- `twitch.tv##+js(twitch-videoad)`


## Installation

1. Open the 'twitchAduBlockOrigin.js' file on GitHub.
2. Click the "Raw" button.
3. Copy the link from the new window displaying the code.
4. Open your browser and access the uBlock Origin settings.
5. Go to the advanced configuration section.
6. Ensure that the "I am an advanced user" option is enabled.
7. Click the configuration button.
8. Locate the 'userResourcesLocation' key, which is set to "unset" by default.
9. Replace 'unset' with the link to the copied code.
10. Save the changes.

Once these steps are completed, the ad blocker for Twitch will be installed in your browser and ready to use.

If you want to disable the script, you can set the `userResourcesLocation` rule back to `unset` and optionally remove the `twitch.tv##+js(twitch-videoad)` parameter from the "My Filters" section.
And save the changes in both sections.

## Additional Tweaks

For further customization and additional features, you can refer to the [additionalTweaks](additionalTweaks) file in the repository. This file contains various keys that can be added to the `My Filters` section of uBlock Origin settings. These keys allow you to remove the `Twitch Turbo` button and achieve a cleaner and ad-free appearance.

Additionally, uBlock Origin provides a convenient feature where you can manually select and block specific elements by right-clicking and using the uBlock Origin shortcut. This gives you the flexibility to add or block elements according to your preferences.

Feel free to explore the [additionalTweaks](additionalTweaks) file and customize your Twitch ad-blocking experience.
* Disclaimer: The rules provided are the ones I use, but you can create your own using the element-blocking function mentioned earlier.

#
# ESPAÑOL
# Bloqueador de Anuncios Local para Twitch

Este proyecto es un bloqueador de anuncios local (No se conecta a enlaces ni scripts externos) para Twitch que ha sido modificado a partir de otro proyecto. La versión modificada está diseñada para ofrecer una experiencia de navegación sin anuncios de manera local y con mayor privacidad. A diferencia de otros bloqueadores de anuncios, este se enfoca exclusivamente en Twitch y no afecta a otras páginas web. 
Disfruta de tus transmisiones favoritas en Twitch sin molestias publicitarias y con mayor control sobre tu privacidad.

## Características

- No se conecta a enlaces externos: El bloqueador de anuncios funciona localmente en tu navegador y no realiza ninguna conexión externa.
- Sin códigos adicionales o enlaces encriptados: El proyecto es transparente y no contiene ningún código adicional ni enlaces encriptados.
- Open source: El código fuente está disponible de forma abierta y puedes contribuir o realizar modificaciones según tus necesidades.
- Compatible con Firefox y LibreWolf: El bloqueador de anuncios es compatible con los navegadores Firefox y LibreWolf.

## Requerimientos obligatorios

- Tener instalado uBlock Origin: Asegúrate de tener instalada la extensión uBlock Origin en tu navegador.
- Activar el bloqueo de anuncios para Twitch: Dentro de uBlock Origin, activa la función de bloqueo de anuncios específica para Twitch utilizando la clave correspondiente.

## Instalación

1. Abre el archivo 'twitchAduBlockOrigin.js' en GitHub.
2. Haz clic en el botón "Raw".
3. Copia el enlace de la nueva ventana que muestra el código.
4. Abre tu navegador y accede a la configuración de uBlock Origin.
5. Ve a la sección de configuración avanzada.
6. Asegúrate de tener habilitada la opción "Soy un usuario avanzado".
7. Haz clic en el botón de configuración.
8. Busca la clave 'userResourcesLocation', que por defecto está configurada como "unset".
9. Reemplaza 'unset' con el enlace al código que copiaste anteriormente.
10. Guarda los cambios.

Una vez realizados estos pasos, el bloqueador de anuncios para Twitch estará instalado en el navegador y listo para funcionar.

Si deseas desactivar el script puedes volver a poner en `'unset'` la regla `'userResourcesLocation'` y opcionalmente remover el parámetro `'twitch.tv##+js(twitch-videoad)'` de la sección "Mis Filtros".
Y guarda los cambios de ambas secciones.

## Modificaciones adicionales
Para una mayor personalización y características adicionales, puedes consultar el archivo [additionalTweaks](additionalTweaks) en el repositorio. Este archivo contiene varias reglas que se pueden agregar a la sección "Mis filtros" de la configuración de uBlock Origin. Estas reglas te permiten eliminar el botón "Twitch Turbo" y lograr una apariencia más limpia y libre de anuncios.

Además, uBlock Origin proporciona una función conveniente donde puedes seleccionar y bloquear manualmente elementos específicos haciendo clic derecho y utilizando el atajo de uBlock Origin. Esto te brinda la flexibilidad de agregar o bloquear elementos según tus preferencias.

Siéntete libre de explorar el archivo [additionalTweaks](additionalTweaks) y personalizar tu experiencia de bloqueo de anuncios en Twitch.
* Disclaimer: las reglas que se proporcionan son las que uso yo, pero puedes crear las tuyas con la funcion de bloquear elementos mencionada antes.
