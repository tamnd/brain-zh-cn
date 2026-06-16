---
title: "CF 105A - 轮回"
description: "该问题模拟角色扮演游戏中的单个穿越过程。 我们从一个已经拥有多项技能的角色开始。 每个技能都有一个名称和经验级别。 当穿越发生时，每一项现有技能的等级都会降低一个系数k。"
date: "2026-06-01T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 105
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 81"
rating: 1700
weight: 105
solve_time_s: 186
verified: true
draft: false
---

[CF 105A - 穿越](https://codeforces.com/problemset/problem/105/A)

 **评分：** 1700
 **标签：** 实施
 **求解时间：** 3m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题模拟角色扮演游戏中的单个穿越过程。 

我们从一个已经拥有多项技能的角色开始。 每个技能都有一个名称和经验级别。 穿越时，现有的所有技能等级都会降低一个系数`k`。 新的级别成为整数部分`k × level`。 

在此减少步骤之后，任何其结果等级严格小于的技能`100`被遗忘并完全消失。 

接下来，角色获得属于目标职业的技能。 如果角色在缩减阶段后已经拥有其中一项技能，则不会发生任何变化。 如果当前不存在该技能，则会添加等级`0`。 

最终的任务是输出这些转换后所有剩余的技能，并按技能名称的字典顺序排序。 

限制非常小。 当前技能数量和目标等级技能数量最多均为`20`。 即使是重复扫描集合的简单实现也很容易足够快。 挑战不在于算法复杂性，而在于正确遵循语句中描述的转换顺序。 

如果以错误的顺序应用规则，一些微妙的情况可能会产生错误的答案。 

考虑：```
1 1 0.50
fire 300
fire
```技能变成`150`还原后存活。 由于本职技能已经存在，因此必须保留`150`。 

正确输出：```
1
fire 150
```粗心的实现可能会覆盖它`0`。 

另一个重要的情况是当本职技能原本存在但在减少后被遗忘时：```
1 1 0.50
fire 180
fire
```减少后的值为`90`，所以这个技能就被遗忘了。 然后班级授予`fire`再次达到水平`0`。 

正确输出：```
1
fire 0
```在删除被遗忘的技能之前检查职业技能的实现会产生错误的结果。 

边界值`100`同样重要的是：```
1 0 0.50
fire 200
```减少的值正好是`100`，它之所以存在，是因为只有严格小于的值`100`被删除。 

正确输出：```
1
fire 100
```使用`<= 100`而不是`< 100`会错误地删除该技能。 

## 方法

 直接模拟立即显现出来。 我们可以处理每一个现有的技能，计算其降低的水平，并只保留那些新水平至少为`100`。 之后，我们处理目标职业技能并添加等级中缺失的技能`0`。 

因为任一列表中最多有二十个技能，所以即使使用嵌套扫描的强力方法也是完全可以接受的。 最坏的情况也只涉及几百次操作。 

一种稍微简洁的方法是使用按技能名称键入的字典。 字典自然地代表了角色当前拥有的技能集。 应用减少和遗忘规则后，添加职业技能就变成了简单的成员资格检查。 

关键的观察是问题纯粹是状态转换。 不涉及优化、图搜索、动态编程或复杂的数据结构。 我们只需要按照给出的确切顺序仔细遵守规则即可。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((n + m)^2) | O((n + m)^2) | O(n + m) | 已接受 |
 | 最佳| O(n + m + z log z) | O(n + m + z log z) | O(n + m) | 已接受 |

 这里`z`是最终答案中的技能数量，排序步骤主导运行时间。 

## 算法演练

 1. 阅读`n`,`m`，和系数`k`。 
2.创建一个空字典，用来存储穿越后的生存技能。 
3. 对于每一个`n`当前技能，计算：```
new_level = floor(k × old_level)
```该语句明确要求取整数部分。 
4. 如果`new_level`至少是`100`，将技能插入具有该值的字典中。 

技能如下`100`被遗忘，不应该出现在字典中。 
5. 阅读全部`m`目标级技能一一列出。 
6. 对于每个职业技能，检查它是否已经存在于字典中。 

如果不存在则用level插入`0`。 

如果它已经存在，则保持其当前值不变。 
7. 提取所有字典条目并按技能名称按字典顺序排序。 
8. 打印技能数量，然后打印每个技能`(name, level)`按排序顺序配对。 

### 为什么它有效

 在第 4 步之后，字典准确地包含了在缩减阶段幸存下来的技能，因为每个原始技能都是根据系数和下面的每个技能进行转换的`100`被删除。 

在步骤6之后，保证每个目标级技能都存在于字典中。 现有的生存技能保留其降低的等级，而缺失的职业技能则按等级添加`0`，完全符合穿越规则。 

由于最终输出只是最终技能集的按字典顺序排列的版本，因此该算法会产生唯一的正确结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k_str = input().split()

    n = int(n)
    m = int(m)

    num, den = map(int, k_str.split('.'))
    k_num = num * 100 + den

    skills = {}

    for _ in range(n):
        name, exp = input().split()
        exp = int(exp)

        new_exp = (exp * k_num) // 100

        if new_exp >= 100:
            skills[name] = new_exp

    for _ in range(m):
        name = input().strip()

        if name not in skills:
            skills[name] = 0

    items = sorted(skills.items())

    out = [str(len(items))]
    for name, level in items:
        out.append(f"{name} {level}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```实现直接遵循模拟。 

一个小细节是系数如何`k`被处理。 使用浮点运算通常可以满足这些约束，但整数运算更干净，并且避免了任何精度问题的可能性。 自从`k`总是恰好包含两位小数，我们将其转换为整数百分比。 例如，`0.75`变成`75`，降低的水平计算如下：```
floor(exp × 75 / 100)
```使用整数除法。 

字典存储遗忘阶段后当前的技能集。 处理职业技能时，简单的成员资格检查即可确定是否应在级别上添加技能`0`。 

最后，对字典项目进行排序会产生所需的字典顺序。 

## 工作示例

 ### 示例 1

 输入：```
5 4 0.75
axe 350
impaler 300
ionize 80
megafire 120
magicboost 220
heal
megafire
shield
magicboost
```处理现有技能后：

 | 技能| 原创| 减少| 保留？ |
 | ---| ---| ---| ---|
 | 斧头| 350 | 350 262 | 262 是的 |
 | 穿刺者 | 300 | 300 225 | 225 是的 |
 | 电离| 80| 60| 没有 |
 | 大火| 120 | 120 90 | 90 没有 |
 | 魔法增强| 220 | 220 165 | 165 是的 |

 当前词典：

 | 技能| 水平|
 | ---| ---|
 | 斧头| 262 | 262
 | 穿刺者 | 225 | 225
 | 魔法增强| 165 | 165

 现在处理班级技能：

 | 职业技能 | 已经存在？ | 行动|
 | ---| ---| ---|
 | 治愈 | 没有 | 添加 0 |
 | 大火| 没有 | 添加 0 |
 | 盾| 没有 | 添加 0 |
 | 魔法增强| 是的 | 保持165 |

 最终词典：

 | 技能| 水平|
 | ---| ---|
 | 斧头| 262 | 262
 | 治愈 | 0 |
 | 穿刺者 | 225 | 225
 | 魔法增强| 165 | 165
 | 大火| 0 |
 | 盾| 0 |

 排序输出：```
6
axe 262
heal 0
impaler 225
magicboost 165
megafire 0
shield 0
```这个例子表明，技能可以在减少过程中消失，然后作为具有等级的本职技能重新引入`0`。 

### 附加示例

 输入：```
2 2 0.50
fire 300
ice 180
fire
wind
```还原阶段：

 | 技能| 原创| 减少| 保留？ |
 | ---| ---| ---| ---|
 | 火| 300 | 300 150 | 150 是的 |
 | 冰| 180 | 180 90 | 90 没有 |

 缩减后的字典：

 | 技能| 水平|
 | ---| ---|
 | 火| 150 | 150

 职业技能阶段：

 | 职业技能 | 已经存在？ | 结果 |
 | ---| ---| ---|
 | 火| 是的 | 保持150 |
 | 风| 没有 | 添加 0 |

 最终状态：

 | 技能| 水平|
 | ---| ---|
 | 火| 150 | 150
 | 风| 0 |

 输出：```
2
fire 150
wind 0
```这个例子表明现有的生存技能永远不会被本职技能覆盖。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m + z log z) | O(n + m + z log z) | 处理技巧是线性的，排序最终清单成本`O(z log z)`|
 | 空间| O(n + m) | 字典存储所有幸存和添加的技能 |

 自从`n`和`m`至多都是`20`，运行时间实际上是瞬时的。 该解决方案在时间和内存使用方面都远远低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import io
import sys

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    output = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = output

    def solve():
        input = sys.stdin.readline

        n, m, k_str = input().split()
        n = int(n)
        m = int(m)

        num, den = map(int, k_str.split('.'))
        k_num = num * 100 + den

        skills = {}

        for _ in range(n):
            name, exp = input().split()
            exp = int(exp)

            val = (exp * k_num) // 100
            if val >= 100:
                skills[name] = val

        for _ in range(m):
            name = input().strip()
            if name not in skills:
                skills[name] = 0

        items = sorted(skills.items())

        print(len(items))
        for name, level in items:
            print(name, level)

    solve()

    sys.stdout = old_stdout
    return output.getvalue()

# sample 1
assert run(
"""5 4 0.75
axe 350
impaler 300
ionize 80
megafire 120
magicboost 220
heal
megafire
shield
magicboost
"""
) == """6
axe 262
heal 0
impaler 225
magicboost 165
megafire 0
shield 0
"""

# minimum input
assert run(
"""1 1 0.50
fire 200
fire
"""
) == """1
fire 100
"""

# forgotten then re-added
assert run(
"""1 1 0.50
fire 180
fire
"""
) == """1
fire 0
"""

# surviving class skill keeps level
assert run(
"""1 1 0.50
fire 300
fire
"""
) == """1
fire 150
"""

# all skills forgotten, class introduces new ones
assert run(
"""2 2 0.01
a 9999
b 5000
c
d
"""
) == """2
c 0
d 0
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 官方解答| 全模拟行为 |
 | 单技能降为100 | 技能生存| 正确的`< 100`检查|
 | 忘记了重新添加| 0级技能| 正确的操作顺序 |
 | 生存阶级技能| 原来的降低水平| 不会出现意外覆盖 |
 | 微小系数| 只剩下职业技能 | 完全遗忘行为 |

 ## 边缘情况

 一项技能的减少值正好变为`100`必须生存。 考虑：```
1 0 0.50
fire 200
```减少后的值为`100`。 因为只有严格低于以下值`100`忘记了，最终输出是：```
1
fire 100
```实现使用`>= 100`，它正确地处理了这个边界。 

减少阶段后本职技能可能已经存在。 考虑：```
1 1 0.50
fire 300
fire
```减少后的值为`150`，因此该技能得以保留。 在处理职业技能时，词典已经包含`"fire"`，所以什么都没有改变。 最终结果依然是：```
1
fire 150
```这可以防止意外更换水平仪`0`。 

技能可以消失，然后由新职业再次授予：```
1 1 0.50
fire 180
fire
```减少后的值变为`90`，所以这个技能就被遗忘了。 班级技能处理然后会看到`"fire"`不存在并用水平插入它`0`。 结果是：```
1
fire 0
```这验证了遗忘发生在添加特定于职业的技能之前，完全按照声明的要求。
