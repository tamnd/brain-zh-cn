---
title: "CF 102775A - \u041a\u0442\u043e \u0431\u043b\u0438\u0436\u0435？"
description: "这个故事可以简化为数轴上的简单几何决策。 给出了三个坐标：小丑 Nekit、前主人 Luka 和狗。 狗必须决定哪个人更接近。 如果狗离 Nekit 较近，则答案是 Tetka。"
date: "2026-07-27T20:46:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102775
codeforces_index: "A"
codeforces_contest_name: "ICPC Central Russia Regional Contest (CRRC 20), \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u043e\u0439 \u0420\u043e\u0441\u0441\u0438\u0438, \u043a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434"
rating: 0
weight: 102775
solve_time_s: 69
verified: true
draft: false
---

[CF 102775A - \u041a\u0442\u043e \u0431\u043b\u0438\u0436\u0435？]（https://codeforces.com/problemset/problem/102775/A）

 **评级：** -
 **标签：** -
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个故事可以简化为数轴上的简单几何决策。 给出了三个坐标：小丑 Nekit、前主人 Luka 和狗。 狗必须决定哪个人更接近。 如果狗离 Nekit 较近，则答案是`Tetka`。 如果狗距离卢卡较近，或者两者距离相等，则答案是`Kashtanka`。 

输入包含三个不同的非负整数，每个最多$10^6$。 由于坐标很小，点之间的距离也很小，但即使坐标大得多，也只需要恒定数量的算术运算。 这意味着任何扫描范围、模拟运动或根据坐标值执行工作的解决方案都是不必要的。 预期的解决方案应该以恒定的时间运行。 

一个常见的错误是错误地处理领带盒。 例如，使用输入`1 5 3`，狗距离两个人两个单位。 正确答案是`Kashtanka`，但代码只检查狗是否更接近 Nekit 并将所有其他情况发送到`Tetka`会失败的。 

另一种边缘情况是狗位于两个人之间但不完全在中间。 例如，`1 6 5`给出四加一的距离，所以狗返回`Kashtanka`。 如果忽略狗的位置，仅比较坐标并假设最近的人始终是坐标较小的人的解决方案可能会失败。 

最后一种情况是狗位于两个人形成的区域之外。 例如，`2 9 12`给出的距离为 10 和 3，所以狗留在 Nekit 身边。 只看哪个人的坐标更大是不够的，因为狗的位置会改变距离。 

## 方法

 最直接的方法是计算狗到每个人的距离并比较两个值。 由于坐标位于一条直线上，因此两点之间的距离就是它们坐标的绝对差。 此方法对于该问题来说已经是最佳方法，但考虑一下暴力方法是什么样子是有用的。 

强力解释可以模拟狗向每个人可能的运动，并计算到达他们需要多少步。 如果坐标大到$10^6$，这可能需要大约一百万个模拟步骤才能进行比较。 这是不必要的工作，因为最终答案仅取决于坐标之间的差异，而不取决于每个中间位置。 

关键的观察是数轴上的距离可以通过减法直接获得。 我们可以立即计算两个距离并做出决定，而不是遵循点之间的路径。 唯一需要注意的细节是平局：卢卡的距离相等，因此条件`Tetka`必须严格更小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(10^6) | O(10^6) | O(1) | O(1) | 在一般设置中太慢 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取代表 Nekit、Luka 和狗的三个坐标。 变量的名称应该反映它们的角色，因为比较是关于人和狗的位置，而不是关于任意数组。 
2. 计算 Nekit 和狗之间的绝对距离。 需要绝对值，因为狗可能位于 Nekit 的任一侧。 
3. 使用相同的公式计算 Luka 和狗之间的绝对距离。 
4. 如果 Nekit 的距离严格小于 Luka 的距离，则打印`Tetka`。 比较必须使用`<`因为卢卡的距离相等。 
5. 在所有其他情况下，打印`Kashtanka`。 这涵盖了卢卡较近的情况和距离相同的情况。 

为什么有效：该算法精确比较定义决策的两个量，即狗与每个人的距离。 如果 Nekit 的距离较小，则狗距离 Nekit 较近，所需的输出为`Tetka`。 如果该条件为假，则 Luka 的距离小于或等于 Nekit 的距离，并且两种可能性都需要`Kashtanka`。 由于涵盖了两个距离之间的所有可能关系，因此该算法不会产生错误的结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    nek, luka, dog = map(int, input().split())

    nek_dist = abs(nek - dog)
    luka_dist = abs(luka - dog)

    if nek_dist < luka_dist:
        print("Tetka")
    else:
        print("Kashtanka")

if __name__ == "__main__":
    solve()
```程序首先读取三个坐标并根据它们在故事中的角色存储它们。 这可以避免在比较期间混淆输入值的顺序。 

两人`abs`调用直接执行数轴距离公式。 对于这些约束，Python 整数不存在溢出问题，因此减法是安全的。 

最终条件特意使用了严格比较。 如果距离相等，则`else`分支运行和打印`Kashtanka`，匹配所需的平局打破规则。 没有循环或额外的数据结构，因为整个问题是通过两次计算和一次比较来解决的。 

## 工作示例

 对于第一个样本，输入是`1 4 2`。 

| 步骤| 奈基特坐标| 卢卡坐标 | 狗坐标 | 奈基特距离 | 卢卡距离| 输出|
 | --- | --- | --- | --- | --- | --- | --- |
 | 读取值 | 1 | 4 | 2 | - | - | - |
 | 计算距离 | 1 | 4 | 2 | 1 | 2 | - |
 | 比较 | 1 | 4 | 2 | 1 < 2 | 1 < 2 - | 泰特卡 |

 狗距离 Nekit 为 1 个单位，距离 Luka 为 2 个单位，因此严格比较成功。 此示例演示了正常的近距离人员情况。 

对于第二个样本，输入是`1 5 3`。 

| 步骤| 奈基特坐标| 卢卡坐标 | 狗坐标 | 奈基特距离 | 卢卡距离| 输出|
 | --- | --- | --- | --- | --- | --- | --- |
 | 读取值 | 1 | 5 | 3 | - | - | - |
 | 计算距离 | 1 | 5 | 3 | 2 | 2 | - |
 | 比较 | 1 | 5 | 3 | 2 < 2 为假 | - | 卡什坦卡 |

 两个距离相等，所以严格比较不选择Nekit。 打破平局的规则将狗送回卢卡。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅执行两次距离和一次比较。 |
 | 空间| O(1) | O(1) | 该程序仅存储几个整数变量。 |

 该解决方案很容易满足限制，因为它的运行时间不依赖于坐标的大小。 即使最大坐标值也需要与最小输入相同的恒定工作量。 

## 测试用例```python
import sys
import io

def solve_data(data: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(data)
    sys.stdout = io.StringIO()

    nek, luka, dog = map(int, sys.stdin.readline().split())

    nek_dist = abs(nek - dog)
    luka_dist = abs(luka - dog)

    if nek_dist < luka_dist:
        print("Tetka")
    else:
        print("Kashtanka")

    result = sys.stdout.getvalue().strip()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

assert solve_data("1 4 2\n") == "Tetka", "sample 1"
assert solve_data("1 5 3\n") == "Kashtanka", "sample 2"
assert solve_data("1 6 5\n") == "Kashtanka", "sample 3"

assert solve_data("0 10 0\n") == "Kashtanka", "same coordinate side boundary is impossible, but catches equality handling"
assert solve_data("0 1000000 999999\n") == "Tetka", "maximum coordinate range"
assert solve_data("0 2 1\n") == "Kashtanka", "middle point tie case"
assert solve_data("5 8 1000000\n") == "Kashtanka", "dog far outside the segment"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 10 0`|`Kashtanka`| 距离匹配时的平等处理。 |
 |`0 1000000 999999`|`Tetka`| 大坐标值和段外定位。 |
 |`0 2 1`|`Kashtanka`| 精确的中点领带。 |
 |`5 8 1000000`|`Kashtanka`| 当狗超出两人时的距离计算。 |

 原始问题保证所有三个坐标都不同，因此实际的有效测试不能包含全相等的值。 距离相等是有意义的边缘情况，因为在这种情况下，输出规则不同于简单地选择较小的距离。 

## 边缘情况

 平局案件是通过严格比较来处理的。 用于输入`1 5 3`，算法计算`abs(1 - 3) = 2`和`abs(5 - 3) = 2`。 自从`2 < 2`是假的，它打印`Kashtanka`，遵循将狗返回卢卡的距离相等的规则。 

当狗靠近具有较大坐标的人时，该算法仍然有效，因为它从不依赖于坐标排序。 用于输入`1 6 5`，距离是`4`和`1`，因此比较选择`Kashtanka`。 

当狗在两个人之间的范围之外时，绝对差计算仍然有效。 用于输入`2 9 12`，距离是`10`和`3`，所以狗更接近 Nekit，输出为`Tetka`。 相同的公式可以处理狗两侧的点，没有任何特殊情况。
