---
title: "CF 2011A - 解决问题"
description: "简列出了一些已知困难的问题。 列表中的最后一个问题比之前的每个问题都更难。 Her skill level is some integer $x$."
date: "2026-06-08T13:09:28+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 2011
codeforces_index: "A"
codeforces_contest_name: "Kotlin Heroes: Episode 11"
rating: 0
weight: 2011
solve_time_s: 108
verified: true
draft: false
---

[CF 2011A - Problem Solving](https://codeforces.com/problemset/problem/2011/A)

 **评级：** -
 **标签：** *特别
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 简列出了一些已知困难的问题。 列表中的最后一个问题比之前的每个问题都更难。 

她的技能水平是某个整数$x$。 She can solve every problem whose difficulty is at most$x$，并且无法解决任何难度大于$x$。 

我们被告知她解决了除了最后一个之外的所有问题。 根据这些信息，我们必须确定是否可以准确识别她的技能水平。 如果恰好有一个可能的值$x$，我们打印它。 如果有几个值$x$满足观察结果，我们打印`Ambiguous`。 

输入给出了多个测试用例。 每个测试用例都包含困难列表。 每个测试用例的输出是独特的技能值或单词`Ambiguous`。 

限制很小。 最多有 1000 个测试用例，每个测试用例最多包含 50 个难度，每个难度最多 50 个。即使对所有可能的技能值进行暴力搜索也足够快。 挑战不在于效率，而在于理解观察结果实际提供了什么信息。 

最常见的错误是假设简的技能必须等于已解决问题中的最大难度。 That is only true in some cases.

 考虑：```
8
8 8 5 3 4 6 8 12
```Jane 解决了难度 8 及以下的所有问题，但在难度 12 上失败了。她的技能可能是 8、9、10 或 11。正确答案是：```
Ambiguous
```另一个微妙的情况是所有已解决的问题都具有相同的难度。```
4
3 3 3 4
```她解决了难度 3，但在难度 4 上失败了。由于技能是整数，所以唯一的可能性是$x=3$。 正确答案是：```
3
```总是打印最大已解决难度的粗心解决方案在这里可能会起作用，但原因是错误的。 

## 方法

 暴力方法很简单。 对于每个可能的整数技能值$x$，检查是否与观察结果一致。 

如果每个解决的问题最多有困难，那么技能值是有效的$x$，最终未解决问题的难度大于$x$。 

由于所有难度最多为 50 个，因此我们可以测试每个难度$x$从 0 到 50 并计算有多少个满足这些条件。 如果恰好有一个有效，请将其打印出来。 否则打印`Ambiguous`。 

该方法是正确的，因为它直接实现了有效技能级别的定义。 其复杂度为$O(50n)$每个测试用例，这很容易足够快。 

关键的观察是我们实际上不需要枚举任何东西。 

让$$m = \max(d_1,d_2,\ldots,d_{n-1})$$成为已解决问题中最大的困难。 

由于简解决了所有先前的问题，她的技能必须满足$$x \ge m.$$由于她最后一道难度题失败了$d_n$,$$x < d_n.$$因此，每个有效的技能值都位于区间内$$m \le x \le d_n-1.$$可能的技能值的数量是$$(d_n-1)-m+1 = d_n-m.$$如果$d_n-m=1$，只有一个可能的值，即$m$。 

如果$d_n-m>1$，可能有多个技能值，答案是`Ambiguous`。 

整个问题简化为将最大已解决难度与最终难度进行比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(50n) | O(50n) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读当前测试用例的难点。 
2. 计算第一个中的最大难度$n-1$问题。 调用这个值`mx`。 

Jane 解决了所有这些问题，因此任何有效的技能必须至少`mx`。 
3.让`last`是最终问题的难度。 

Jane 无法解决这个问题，因此任何有效的技能都必须严格小于`last`。 
4. 有效技能值均为范围内的整数`[mx, last-1]`。 
5. 如果`last - mx == 1`，该范围恰好包含一个整数，即`mx`。 打印`mx`。 
6. 否则范围包含多个整数。 打印`Ambiguous`。 

### 为什么它有效

 每个解决的问题都会对技能水平施加一个下限，而最强的下限就是解决的最大难度`mx`。 

失败的最终问题施加了一个上限，即$x < \text{last}$。 

其他信息都不重要。 这些界限之间的任何整数都满足所有观察结果。 因此可行技能的集合正是区间$[mx, \text{last}-1]$。 

如果该区间包含一个整数，则该技能是唯一确定的。 如果它包含多个整数，则有几种技能符合证据，答案必须是`Ambiguous`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())

for _ in range(t):
    n = int(input())
    d = list(map(int, input().split()))

    mx = max(d[:-1])
    last = d[-1]

    if last - mx == 1:
        print(mx)
    else:
        print("Ambiguous")
```解决方案直接遵循数学特征。 

变量`mx`存储所有已解决问题中最大的困难。 任何有效的技能都必须至少是这个值。 

变量`last`存储唯一未解决问题的难度。 任何有效的技能都必须小于该值。 

因此，可行技能的区间为`[mx, last - 1]`。 当以下情况时，该区间恰好包含一个整数：`last - mx == 1`。 在这种情况下我们打印`mx`。 否则有多种可能的技能，我们打印`Ambiguous`。 

除了记住最后一个问题被排除在最大计算之外之外，没有任何棘手的边界条件。 使用`max(d[:-1])`正确处理这个问题。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2 3 4 5
```| 步骤| 价值|
 | --- | --- |
 |`mx`| 4 |
 |`last`| 5 |
 | 有效技能 | {4} |
 | 输出| 4 |

 可行区间为`[4, 4]`，其中仅包含一个值。 简的技艺是独一无二的。 

### 示例 2

 输入：```
8
8 8 5 3 4 6 8 12
```| 步骤| 价值|
 | --- | --- |
 |`mx`| 8 |
 |`last`| 12 | 12
 | 有效技能 | {8,9,10,11}|
 | 输出| 暧昧|

 几个技能值满足所有观察结果。 它们之间没有什么区别，所以答案是`Ambiguous`。 

这些例子说明了中心不变量：每项有效技能都必须位于已解决的最大难度和失败的难度之间。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 一次扫描找出前 n-1 个元素中的最大值 |
 | 空间| O(1) | O(1) | 仅存储了几个变量|

 和$n \le 50$，运行时间可以忽略不计。 即使在所有 1000 个测试用例中，该解决方案也仅执行几万次操作，并且很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        d = list(map(int, input().split()))

        mx = max(d[:-1])
        last = d[-1]

        if last - mx == 1:
            ans.append(str(mx))
        else:
            ans.append("Ambiguous")

    print("\n".join(ans))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return out

# provided sample
assert run(
"""3
5
1 2 3 4 5
8
8 8 5 3 4 6 8 12
4
3 3 3 4
"""
) == "4\nAmbiguous\n3\n"

# minimum size
assert run(
"""1
2
1 2
"""
) == "1\n"

# ambiguous interval of length 3
assert run(
"""1
2
1 4
"""
) == "Ambiguous\n"

# all solved difficulties equal
assert run(
"""1
5
7 7 7 7 8
"""
) == "7\n"

# boundary value near maximum difficulty
assert run(
"""1
4
50 50 50 51
"""
) == "50\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2`|`1`| 最小有效尺寸|
 |`1 4`|`Ambiguous`| 多种可行技能|
 |`7 7 7 7 8`|`7`| 所有已解决的困难都是平等的 |
 |`50 50 50 51`|`50`| 接近最大难度的边界值|

 ## 边缘情况

 ### 多种可能的技能

 输入：```
1
2
3 7
```该算法计算：

 | 变量| 价值|
 | --- | --- |
 |`mx`| 3 |
 |`last`| 7 |

 有效技能为 3、4、5 和 6。`last - mx = 4`，可以有不止一种技能。 输出是：```
Ambiguous
```始终打印的解决方案`mx`会错的。 

### 正是一种可能的技能

 输入：```
1
4
3 3 3 4
```该算法计算：

 | 变量| 价值|
 | --- | --- |
 |`mx`| 3 |
 |`last`| 4 |

 可行区间为`[3, 3]`，仅包含一个值。 输出是：```
3
```这证实了重复解决的困难本身并不会产生歧义。 

### 最难解决的问题之后的巨大差距

 输入：```
1
5
1 2 3 4 10
```该算法计算：

 | 变量| 价值|
 | --- | --- |
 |`mx`| 4 |
 |`last`| 10 | 10

 可能的技能有 4、5、6、7、8 和 9。输出为：```
Ambiguous
```最难解决的问题和失败的问题之间的差距直接决定了还可能有多少技能值。 

### 最小可行区间

 输入：```
1
3
5 2 6
```该算法计算：

 | 变量| 价值|
 | --- | --- |
 |`mx`| 5 |
 |`last`| 6 |

 间隔为`[5, 5]`，所以答案是：```
5
```这证明了唯一性的确切条件：失败问题的难度必须比最难解决的问题大一。
