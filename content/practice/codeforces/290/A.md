---
title: "CF 290A - 神秘的琴弦"
description: "整个任务是愚人节竞赛中的一个笑话问题。 输入是 1 到 40 之间的单个整数 a。我们必须输出与该位置关联的特定字符串，而不是计算任何内容。"
date: "2026-06-05T16:49:16+07:00"
tags: ["codeforces", "competitive-programming", "*special", "implementation"]
categories: ["algorithms"]
codeforces_contest: 290
codeforces_index: "A"
codeforces_contest_name: "April Fools Day Contest 2013"
rating: 1400
weight: 290
solve_time_s: 83
verified: true
draft: false
---

[CF 290A - 神秘的弦](https://codeforces.com/problemset/problem/290/A)

 **评分：** 1400
 **标签：** *特殊、实施
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 整个任务是愚人节竞赛中的一个笑话问题。 

输入是单个整数`a`1 到 40 之间。我们必须输出与该位置关联的特定字符串，而不是计算任何内容。 样本值表明`2`映射到`"Adams"`,`8`映射到`"Van Buren"`， 和`29`映射到`"Harding"`。 隐藏的观察是，这些数字对应于按时间顺序排列的美国前四十位总统。 所需的输出只是姓氏`a`- 第任总统。 

约束很小。 自从`a`永远不会超过 40，任何存储 40 个字符串并执行单次查找的解决方案实际上都是瞬时的。 

错误的唯一真正来源是索引。 

例如，使用输入```
1
```正确的输出是```
Washington
```因为列表是从 1 开始编号的。直接使用输入作为从零开始的数组索引的粗心实现将返回第二个条目。 

输入时出现另一个常见错误```
40
```正确的输出是```
Reagan
```该数组恰好包含四十个元素，因此最后一个有效的从零开始的索引是`39`。 访问索引`40`就会出界。 

## 方法

 暴力的观点是手动检查所有可能的值`a`并使用长链打印相应的答案`if`声明。 由于只有四十种可能性，这已经足够快了。 

更简洁的方法将所有四十个姓氏存储在一个数组中。 那么问题就变成了直接查表。 输入值是从 1 开始的，而数组通常是从 0 开始的，所以答案存储在位置`a - 1`。 

由于输入范围是固定的，暴力版本已经以恒定的时间运行。 阵列解决方案是首选，因为它更短、更容易验证并且不易出错。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（`if`链） | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 最优（数组查找）| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 创建一个数组，其中包含按时间顺序排列的前 40 位美国总统的姓氏。 
2.读取整数`a`。 
3.通过计算将从1开始的位置转换为从0开始的数组索引`a - 1`。 
4. 输出存储在该索引处的字符串。 

为什么它有效：

 构造数组以便位置`i`包含总统编号对应的姓氏`i + 1`。 输入值`a`要求`a`该序列中的第 - 个条目。 访问索引`a - 1`准确检索该姓氏，因此生成的输出与每个有效输入所需的映射匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

presidents = [
    "Washington", "Adams", "Jefferson", "Madison", "Monroe",
    "Adams", "Jackson", "Van Buren", "Harrison", "Tyler",
    "Polk", "Taylor", "Fillmore", "Pierce", "Buchanan",
    "Lincoln", "Johnson", "Grant", "Hayes", "Garfield",
    "Arthur", "Cleveland", "Harrison", "Cleveland",
    "McKinley", "Roosevelt", "Taft", "Wilson", "Harding",
    "Coolidge", "Hoover", "Roosevelt", "Truman",
    "Eisenhower", "Kennedy", "Johnson", "Nixon",
    "Ford", "Carter", "Reagan"
]

a = int(input())
print(presidents[a - 1])
```该数组包含问题所需的整个映射。 读取输入会给出 1 到 40 之间的值。由于 Python 列表从 0 开始索引，因此正确的元素是`presidents[a - 1]`。 

唯一微妙的一点是索引转换。 忘记了`- 1`将每个答案移动一个位置，并导致错误答案或超出范围的访问`a = 40`。 

## 工作示例

 ### 示例 1

 输入：```
2
```| 步骤| 一个 | 使用索引 | 输出|
 | ---| ---| ---| ---|
 | 读取输入| 2 | - | - |
 | 计算索引| 2 | 1 | - |
 | 查找 | 2 | 1 | 亚当斯 |

 输出：```
Adams
```此跟踪显示从 1 到从 0 的转换。 第二任总统存储在数组索引 1 处。 

### 示例 2

 输入：```
29
```| 步骤| 一个 | 使用索引 | 输出|
 | ---| ---| ---| ---|
 | 读取输入| 29 | 29 - | - |
 | 计算索引| 29 | 29 28 | 28 - |
 | 查找 | 29 | 29 28 | 28 哈丁|

 输出：```
Harding
```此示例证实该解决方案对于列表深处的位置同样有效。 不需要迭代或搜索。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 一个数组访问 |
 | 空间| O(1) | O(1) | 40 个字符串的固定大小数组 |

 运行时间与输入值无关。 单个查找和打印操作很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

PRESIDENTS = [
    "Washington", "Adams", "Jefferson", "Madison", "Monroe",
    "Adams", "Jackson", "Van Buren", "Harrison", "Tyler",
    "Polk", "Taylor", "Fillmore", "Pierce", "Buchanan",
    "Lincoln", "Johnson", "Grant", "Hayes", "Garfield",
    "Arthur", "Cleveland", "Harrison", "Cleveland",
    "McKinley", "Roosevelt", "Taft", "Wilson", "Harding",
    "Coolidge", "Hoover", "Roosevelt", "Truman",
    "Eisenhower", "Kennedy", "Johnson", "Nixon",
    "Ford", "Carter", "Reagan"
]

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    a = int(sys.stdin.readline())
    return PRESIDENTS[a - 1] + "\n"

# provided sample
assert run("2\n") == "Adams\n", "sample 1"

# custom cases
assert run("1\n") == "Washington\n", "first element"
assert run("40\n") == "Reagan\n", "last element"
assert run("8\n") == "Van Buren\n", "middle value"
assert run("29\n") == "Harding\n", "another known mapping"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1`|`Washington`| 最小有效指数 |
 |`40`|`Reagan`| 最大有效索引 |
 |`8`|`Van Buren`| 正确的中间查找 |
 |`29`|`Harding`| 另一个不平凡的职位|

 ## 边缘情况

 考虑最小的输入：```
1
```该算法计算`1 - 1 = 0`并访问第一个数组元素。 输出是：```
Washington
```这确认了第一个位置已正确处理并且没有发生负索引。 

考虑最大输入：```
40
```该算法计算`40 - 1 = 39`并访问最后一个有效的数组位置。 输出是：```
Reagan
```这验证了实现是否在数组范围内。 

考虑接近开头的值：```
2
```计算出的指数为`1`，生产：```
Adams
```此案例捕获了经典的相差一错误。 如果省略减法，程序将错误地返回`"Jefferson"`反而。
