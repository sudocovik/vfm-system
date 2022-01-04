import { ComponentToBeMounted, VueComponent } from 'test/support/ComponentToBeMounted'
import { ModelValueProperty } from 'test/support/ModelValueProperty'

export class ComponentUnderTest {
  public static ModelValue: ModelValueProperty = new ModelValueProperty()

  public static is (component: VueComponent): ComponentToBeMounted {
    return new ComponentToBeMounted(component)
  }
}
