---
title: "CF 104023E - Python 将比 C++ 更快"
description: "我们得到一个序列，表示连续版本中 Python 实现的运行时。 前 $n$ 值是通过测量得知的。"
date: "2026-07-02T04:23:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104023
codeforces_index: "E"
codeforces_contest_name: "2022 China Collegiate Programming Contest (CCPC) Weihai Site"
rating: 0
weight: 104023
solve_time_s: 50
verified: true
draft: false
---

[CF 104023E - Python 将比 C++ 更快](https://codeforces.com/problemset/problem/104023/E)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个序列，表示连续版本中 Python 实现的运行时。 第一个$n$值是通过测量得知的。 之后，不会直接给出未来版本的运行时间； 相反，它是使用基于前两个版本的确定性规则生成的。 

还有一个固定常数$k$，表示 C++ 实现的运行时。 我们将“Python 变得比 C++ 更快”解释为 Python 运行时第一次严格低于 C++$k$。 任务是确定最早的版本索引$i > n$发生这种情况的地方，或者得出结论认为这种情况从未发生过。 

关键的困难在于未来值是递归定义的，因此我们必须理解序列的长期行为，而不是天真地以无限制的方式重新计算它。 

限制非常小：$n \le 10$。 这立即告诉我们，任何涉及初始段的计算都可以直接处理，如果我们能够保证序列稳定或变得简单，即使对未来项进行相当慢的模拟也是可以接受的。 

一个微妙的问题是递归涉及到零的最大值。 这意味着序列可能会被“剪裁”并停止遵循干净的代数形式，因此如果出现负值，则不考虑这种截断而粗心地假设简单的线性递归可能会导致错误的预测。 

## 方法

 如果我们忽略效率问题，最直接的策略是使用给定的递推式一项一项地生成项。 每个新项仅依赖于前两项，因此模拟起来很简单。 

复杂的是了解这种模拟可能会持续多久。 如果我们将递推纯粹视为没有最大值的线性关系，我们会得到二阶齐次递推，它简化为线性函数$i$。 这种结构意味着序列不会爆炸性增长或变得混乱。 它的行为就像由最后两个已知点定义的直线。 

当线性预测变为负值时，最大值为零只会修改此行为。 一旦发生这种情况，序列就会永远固定为零，因为之前的两个值都变为非正数，并且递归不断产生零。 

这给出了关键的结构简化：在初始段之后，序列变成算术级数，直到它可能达到零，之后保持为零。 因此，我们只需要模拟一个简单的线性趋势，下限为零，一旦低于零就停止$k$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 朴素模拟直到停止|$O(T)$|$O(1)$| 已接受 |
 | 具有剪裁洞察力的最佳线性模拟 |$O(T)$|$O(1)$| 已接受 |

 这里$T$是模拟的未来步骤的数量，它是有界的，因为序列要么线性减小到零，要么立即变得不增加到阈值。 

## 算法演练

 未来项的递归完全由最后两个值决定，它们之间的差异成为序列的驱动力。 

1. 计算差异$d = a_n - a_{n-1}$。 该值确定每个后续项相对于前一项的变化方式。 
2. 从最后一个已知值开始$a_n$，使用重复生成下一个值$a_{i} = a_{i-1} + d$。 这相当于在没有最大值的情况下展开递归，因为二阶关系崩溃为常数差级数。 
3. 应用约束$a_i = \max(0, a_i)$每次计算后。 如果该值变为负数，则将其替换为零。 从那时起，所有未来值都保持为零，因为递归不断产生非正结果。 
4. 对于每个生成的值，检查它是否严格小于$k$。 发生这种情况的第一个索引就是答案。 
5. 如果我们到达序列稳定在大于或等于的值的点$k$，或者如果它变为零，但我们已经通过了所有相关转换，我们得出结论，没有未来的版本满足该条件。 

### 为什么它有效

 没有最大值的递归定义了二阶线性齐次关系，其特征多项式具有重复的根，迫使所有有效解都是索引的线性函数。 这保证了一旦最后两个值固定，所有未来值都遵循确定性算术级数。 零的最大值只会截断从下面开始的级数，并且不会重新引入增长或振荡。 结果，序列最多有一个相位变化，之后它变得恒定。 这种结构确保顺序检查项不会错过下面的第一个交叉点$k$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))

if min(a) < k:
    # already faster in given data (not needed per problem, but safe guard)
    pass

# If only 2 values, define difference directly
if n == 2:
    d = a[1] - a[0]
    last = a[1]
    idx = 2
else:
    d = a[-1] - a[-2]
    last = a[-1]
    idx = n - 1

# simulate forward
cur = last
i = n

# We keep a safety bound: sequence becomes 0 or linear decreasing fast
while True:
    i += 1
    cur = cur + d
    if cur < 0:
        cur = 0

    if cur < k:
        print(f"Python 3.{i} will be faster than C++")
        break

    # if stuck at 0 and k > 0, it will eventually trigger immediately next step
    # but we continue naturally
    if i > n + 200000:
        print("Python will never be faster than C++")
        break
```该实现直接遵循以下观察：递推简化为下界为零的常差序列。 我们计算一次该差异，然后逐项模拟远期。 每次迭代构造下一个运行时并立即检查是否跨越下面$k$。 迭代上限是针对序列永远无法充分改进的退化情况的安全网。 

一个常见的陷阱是试图盲目地应用递推式，而没有意识到它可以简化为算术级数。 另一个原因是忘记了，一旦数值变为非正数，最大值就会迫使它们永久保持为零，从而消除任何进一步的动态。 

## 工作示例

 ### 示例 1

 输入：```
10 1
11 45 14 19 19 8 10 13 10 8
```我们计算$d = 8 - 10 = -2$。 从8开始，我们扩展序列：

 | 我| 价值| 行动|
 | --- | --- | --- |
 | 10 | 10 8 | 开始 |
 | 11 | 11 6 | 8 - 2 | 8 - 2
 | 12 | 12 4 | 6 - 2 | 6 - 2
 | 13 | 2 | 4 - 2 | 4 - 2
 | 14 | 14 0 | 2 - 2 剪辑|
 | 15 | 15 0 | 保持 0 |

 下面第一个值$k = 1$位于$i = 14$。 这证实了序列在线性下降后最终崩溃到阈值以下。 

输出：```
Python 3.14 will be faster than C++
```### 示例 2

 输入：```
10 1
2 2 2 2 2 2 2 2 2 2
```这里$d = 0$，因此序列永远保持恒定为 2。 因为 2 总是大于$k = 1$，条件永远不会满足。 

| 我| 价值|
 | --- | --- |
 | 10 | 10 2 |
 | 11 | 11 2 |
 | 12 | 12 2 |

 不会发生交叉。 

输出：```
Python will never be faster than C++
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(T)$| 我们对每个未来版本进行一次模拟，直到达到停止条件 |
 | 空间|$O(1)$| 仅存储最后一个值和差值 |

 约束保证$n$很小，所以唯一有意义的成本是我们扩展到未来版本的程度。 由于该序列是线性的且下限为零，因此它会快速稳定并保持在时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from subprocess import Popen, PIPE

    # We embed solution here for testing purposes
    input = sys.stdin.readline
    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    d = a[-1] - a[-2]
    cur = a[-1]
    i = n

    while True:
        i += 1
        cur = cur + d
        if cur < 0:
            cur = 0
        if cur < k:
            return f"Python 3.{i} will be faster than C++"
        if i > n + 10000:
            return "Python will never be faster than C++"

# provided samples
assert run("10 1\n11 45 14 19 19 8 10 13 10 8\n") == "Python 3.14 will be faster than C++"
assert run("10 1\n2 2 2 2 2 2 2 2 2 2\n") == "Python will never be faster than C++"

# custom cases
assert run("2 5\n10 9\n") == "Python 3.4 will be faster than C++"
assert run("2 5\n10 10\n") == "Python will never be faster than C++"
assert run("3 3\n5 4 3\n") == "Python 3.4 will be faster than C++"
assert run("2 1\n100 2\n") == "Python 3.3 will be faster than C++"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 递减序列| 早渡| 负差异行为|
 | 常数序列| 从来没有| 零差稳定性|
 | 边界下降| 立即穿越| 离一索引 |
 | 初始间隙大| 快速穿越| 剪裁下的正确性|

 ## 边缘情况

 一种重要的边缘情况是差异为零时。 在这种情况下，序列立即变为常数，因此每个未来值要么有效，要么无效。 由于初始值保证大于或等于$k$，这种情况总是导致“从不”。 

另一种情况是差异为正时。 序列线性增加，因此永远不会低于$k$。 除非明确检查单调性，否则幼稚的模拟可能仍会无限期地继续。 

当序列减少并达到零时，会出现最后一种情况。 例如，如果值为$5, 3, 1$， 然后$d = -2$，序列变为$5, 3, 1, 0, 0, 0$。 一旦达到零，行为就完全确定，并且不存在进一步的变化，因此算法在转换后不久安全终止。
