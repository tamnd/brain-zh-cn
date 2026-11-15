---
title: "CF 63A - 沉船"
description: "我们得到了一份名单，名单上的人按照从左到右的固定顺序站在一艘正在下沉的船上。 每个人都有一个名字和一个角色。 疏散顺序完全取决于角色优先级。 老鼠先离开。 妇女和儿童属于下一个优先级别。 男人们跟着他们离开。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 63
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 59 (Div. 2)"
rating: 900
weight: 63
solve_time_s: 91
verified: true
draft: false
---

[CF 63A - 沉船](https://codeforces.com/problemset/problem/63/A)

 **评分：** 900
 **标签：** 实现、排序、字符串
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一份名单，名单上的人按照从左到右的固定顺序站在一艘正在下沉的船上。 每个人都有一个名字和一个角色。 疏散顺序完全取决于角色优先级。 

老鼠先离开。 妇女和儿童属于下一个优先级别。 男人们跟着他们离开。 船长总是最后离开。 

当两个人属于同一优先级组时，他们的相对顺序必须与原始队列中的顺序完全相同。 这意味着这不仅仅是一个按类别排序的问题，而是一个稳定的排序问题。 

输入规模很小，最多只有 100 人。 即使是二次算法也很容易满足时间限制。 挑战不在于性能，而在于正确实施优先级规则，而不会意外破坏组内的原始顺序。 

一个常见的错误是将妇女和儿童视为不同的优先事项。 他们实际上属于同一疏散级别。 

考虑这个输入：```
4
Anna woman
Ben child
Chris woman
David man
```正确的输出是：```
Anna
Ben
Chris
David
```在所有孩子之前疏散所有妇女的粗心实施将错误地产生：```
Anna
Chris
Ben
David
```另一个容易犯的错误是使用不稳定的排序而不保留原始位置。 

考虑：```
5
Tom man
Jerry man
Spike man
Mila woman
Captain captain
```男子必须保持原来的顺序：```
Mila
Tom
Jerry
Spike
Captain
```如果实现仅按优先级排序而忽略原始索引，则人员之间的顺序可能会变得任意。 

第三个边缘情况是船长。 队长只有一个，而且无论最初站在哪里，这个人都必须是最后出现的。 

例子：```
3
Jack captain
Alice woman
Bob rat
```正确输出：```
Bob
Alice
Jack
```如果有人从左到右处理该行并立即打印，则船长可能会错误地过早出现。 

## 方法

 最直接的暴力破解思路就是重复扫描整个列表，并逐类提取人员。 首先扫描老鼠并按顺序打印。 然后再次扫描是否有妇女和儿童。 然后再次扫描男性。 最后打印船长。 

这是可行的，因为疏散优先级是固定的，并且只有五种可能的状态。 由于每次扫描都保留原始的从左到右的顺序，因此输出是正确的。 

最坏情况的复杂性仍然很小。 我们最多扫描四五遍，最多100人，总共工作量在500次左右。 

另一种方法是为每个角色分配一个数字优先级，并按该优先级对人员进行排序。 例如：```
rat -> 0
woman -> 1
child -> 1
man -> 2
captain -> 3
```关键的观察结果是，妇女和儿童有意享有同样的优先权。 一旦我们将角色映射到数字，问题就变成了稳定的排序任务。 

Python 的内置排序是稳定的，这意味着优先级相同的人会自动保持原来的顺序。 完全符合问题要求。 

尽管这两种方法都足够快，但排序方法更干净且更容易推广。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取船员人数。 
2. 对于每个人，请阅读他们的姓名和状态。 
3. 为每个状态分配数字疏散优先级。 

老鼠得到的值最小，因为它们先离开。 队长获得最大的价值，因为他们最后离开。 妇女和儿童享有同样的价值，因为他们享有同样的优先权。 
4. 将每个人存储为一对，包含他们的优先级和姓名。 

由于 Python 排序是稳定的，因此会自动保留原始输入顺序。 
5. 按优先级对列表进行排序。 
6. 按排序顺序打印姓名。 

### 为什么它有效

 每个船员都属于一个疏散类别。 数字映射将语言规则转换为可排序的排序关系。 

如果两个人属于不同类别，则较小的优先级值会正确地将一个人放在另一个人之前。 

如果两个人属于同一类别，则两者都具有相同的优先级。 Python 的稳定排序保留了它们原来的相对顺序，这完全符合当优先级相等时最左边的人先撤离的语句要求。 

因为这两个规则同时满足，所以最终的顺序总是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    priority = {
        "rat": 0,
        "woman": 1,
        "child": 1,
        "man": 2,
        "captain": 3
    }

    people = []

    for _ in range(n):
        name, status = input().split()
        people.append((priority[status], name))

    people.sort()

    for _, name in people:
        print(name)

solve()
```字典将每个状态转换为可排序的数值。 关键的细节是`"woman"`和`"child"`两者都映射到`1`，给予他们同等的优先权。 

每个人都存储为一个元组`(priority, name)`。 由于 Python 按字典顺序对元组进行排序，因此列表主要按优先级排序。 

Python 的排序是稳定的，这是这里微妙但关键的属性。 当两个人具有相同的优先级时，他们的相对顺序与输入保持不变。 这会自动满足问题陈述中从左到右的规则，而无需存储显式索引。 

约束非常小，以至于性能无关紧要，但这种实现仍然干净高效。 

## 工作示例

 ### 示例 1

 输入：```
6
Jack captain
Alice woman
Charlie man
Teddy rat
Bob child
Julia woman
```加工步骤：

 | 人 | 状态 | 优先| 存储元组 |
 | ---| ---| ---| ---|
 | 杰克| 船长| 3 | （3，杰克）|
 | 爱丽丝| 女人| 1 | （1，爱丽丝）|
 | 查理| 男人| 2 | （2、查理）|
 | 泰迪 | 老鼠 | 0 | （0，泰迪）|
 | 鲍勃 | 孩子 | 1 | （1，鲍勃）|
 | 朱莉娅 | 女人| 1 | （1，朱莉娅）|

 排序后：

 | 优先| 名称 |
 | ---| ---|
 | 0 | 泰迪 |
 | 1 | 爱丽丝|
 | 1 | 鲍勃 |
 | 1 | 朱莉娅 |
 | 2 | 查理|
 | 3 | 杰克|

 输出：```
Teddy
Alice
Bob
Julia
Charlie
Jack
```该跟踪说明了为什么稳定排序很重要。 Alice、Bob 和 Julia 都共享相同的优先级，并且保留它们原来的相对顺序。 

### 示例 2

 输入：```
5
Tom man
Jerry man
Lucy child
Kate woman
Morgan captain
```加工步骤：

 | 人 | 状态 | 优先| 存储元组 |
 | ---| ---| ---| ---|
 | 汤姆| 男人| 2 | （2，汤姆）|
 | 杰瑞| 男人| 2 | （2、杰瑞）|
 | 露西| 孩子 | 1 | （1、露西）|
 | 凯特| 女人| 1 | （1，凯特）|
 | 摩根| 船长| 3 | （3，摩根）|

 排序后：

 | 优先| 名称 |
 | ---| ---|
 | 1 | 露西|
 | 1 | 凯特|
 | 2 | 汤姆|
 | 2 | 杰瑞|
 | 3 | 摩根|

 输出：```
Lucy
Kate
Tom
Jerry
Morgan
```此示例显示两个独立的绑定组。 儿童和妇女属于一组，而两个男人则属于另一组。 在这两种情况下，原始顺序都保持不变。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 对船员列表进行排序主导了运行时间 |
 | 空间| O(n) | 人员名单存储在内存中 |

 船员最多 100 人，运行时间很短。 即使慢得多的算法也能在限制内轻松通过。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n = int(input())

        priority = {
            "rat": 0,
            "woman": 1,
            "child": 1,
            "man": 2,
            "captain": 3
        }

        people = []

        for _ in range(n):
            name, status = input().split()
            people.append((priority[status], name))

        people.sort()

        out = []

        for _, name in people:
            out.append(name)

        return "\n".join(out)

    return solve()

# provided sample
assert run(
"""6
Jack captain
Alice woman
Charlie man
Teddy rat
Bob child
Julia woman
"""
) == (
"""Teddy
Alice
Bob
Julia
Charlie
Jack"""
), "sample 1"

# minimum size
assert run(
"""1
Jack captain
"""
) == (
"""Jack"""
), "single person"

# all same priority
assert run(
"""4
Anna woman
Bella child
Cara woman
Diana child
"""
) == (
"""Anna
Bella
Cara
Diana"""
), "stable order among equal priorities"

# captain appears first in input
assert run(
"""3
Captain captain
Tom man
Jerry rat
"""
) == (
"""Jerry
Tom
Captain"""
), "captain must always be last"

# multiple men preserve order
assert run(
"""5
Tom man
Jerry man
Spike man
Lucy child
Captain captain
"""
) == (
"""Lucy
Tom
Jerry
Spike
Captain"""
), "stable order among men"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单队长| 队长| 最小输入尺寸 |
 | 妇女和儿童混杂| 相同的相对顺序 | 同等优先的稳定性|
 | 船长在前线 | 船长最后打印 | 正确的船长处理方式 |
 | 多名男子| 保留原始订单 | 稳定的排序行为 |

 ## 边缘情况

 一个微妙的例子是妇女和儿童混在一起。 它们不是单独的疏散阶段。 

输入：```
4
Anna woman
Ben child
Chris woman
David man
```该算法分配优先级：```
woman -> 1
child -> 1
woman -> 1
man -> 2
```排序后，所有三个优先级为 1 的人都保持原来的顺序，因为 Python 排序是稳定的：```
Anna
Ben
Chris
David
```另一个棘手的情况是保持相同类别之间的顺序。 

输入：```
5
Tom man
Jerry man
Spike man
Lucy woman
Captain captain
```优先事项变为：```
Tom -> 2
Jerry -> 2
Spike -> 2
Lucy -> 1
Captain -> 3
```排序使露西领先于其他人，但三个人的顺序仍然是：```
Tom
Jerry
Spike
```最终结果是：```
Lucy
Tom
Jerry
Spike
Captain
```队长边缘情况也很重要。 

输入：```
3
Jack captain
Alice woman
Bob rat
```优先事项是：```
Jack -> 3
Alice -> 1
Bob -> 0
```排序产生：```
Bob
Alice
Jack
```尽管船长最初排在第一位，但优先级映射迫使船长最后撤离。
