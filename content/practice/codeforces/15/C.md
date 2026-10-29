---
title: "CF 15C - 工业尼姆"
description: "每个采石场都会为标准 Nim 游戏贡献一系列连续的堆大小。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "games"]
categories: ["algorithms"]
codeforces_contest: 15
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 15"
rating: 2000
weight: 15
solve_time_s: 145
verified: true
draft: false
---
[CF 15C - 工业 Nim](https://codeforces.com/problemset/problem/15/C)

 **评级：** 2000
 **标签：** 游戏
 **求解时间：** 2m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个采石场都会为标准 Nim 游戏贡献一系列连续的堆大小。 

如果采石场给我们带来价值`(x, m)`，那么它的转储器包含：$$x,\ x+1,\ x+2,\ \dots,\ x+m-1$$来自所有采石场的所有自卸车一起形成一个大型 Nim 阵地。 由于使用的是普通 Nim，获胜者仅取决于所有堆大小的异或。 如果总异或非零，则第一个玩家获胜。 否则第二个玩家获胜。 

任务的直接解释是：$$(x) \oplus (x+1) \oplus \dots \oplus (x+m-1)$$对于每个采石场，然后将所有这些结果异或在一起。 

这些约束完全排除了单独遍历堆的可能性。 一个采石场最多可容纳$10^{16}$倾倒者，并且可能有$10^5$采石场。 连存储所有堆都是不可能的，更不用说一一处理了。 

这迫使我们寻找对连续整数进行异或的数学捷径。 

棘手的部分是，许多程序员记住范围总和的公式，但异或的行为不同。 幼稚的适应常常在边界条件下失败。 

考虑这个输入：```
1
1 4
```这些堆是：```
1 2 3 4
```他们的异或是：$$1 \oplus 2 \oplus 3 \oplus 4 = 4$$尝试手动导出模式的粗心实现可能很容易产生`0`这里。 

另一个容易犯的错误是错误地处理从零开始的范围。 标准前缀异或公式使用：$$0 \oplus 1 \oplus 2 \oplus \dots \oplus n$$假设我们处理：```
1
2 1
```答案很简单`2`，因为只有一个堆。 如果我们计算：$$f(r) \oplus f(l)$$而不是：$$f(r) \oplus f(l-1)$$我们立即得到错误的结果。 

大的值也很重要。 数字高达$10^{16}$，任何固定宽度的 32 位整数逻辑在许多语言中都会溢出。 Python 会自动处理这个问题，但算法仍然必须保持每个采石场的对数或恒定时间。 

## 方法

 暴力破解的想法非常简单。 对于每个采石场，生成区间内的所有堆大小：$$[x,\ x+m-1]$$并将它们异或在一起。 

这是可行的，因为 Nim 位置通过异或组合。 如果最终的异或非零，则第一个玩家获胜。 否则第二个玩家就输了。 

问题在于规模。 单个采石场可容纳$10^{16}$堆。 即使每秒处理 10 亿次操作，速度仍然慢得令人绝望。 在最坏的情况下，暴力破解大约需要：$$10^5 \times 10^{16} = 10^{21}$$运营。 

关键的观察是连续整数的异或具有重复结构。 

定义：$$pref(n)=0 \oplus 1 \oplus 2 \oplus \dots \oplus n$$然后对任何区间进行异或变为：$$l \oplus (l+1) \oplus \dots \oplus r = pref(r)\oplus pref(l-1)$$因为之前的每个值`l`出现两次并自行取消。 

现在我们只需要一种快速的计算方法`pref(n)`。 

如果我们写出几个值：

 | n | 偏好 (n) |
 | --- | --- |
 | 0 | 0 |
 | 1 | 1 |
 | 2 | 3 |
 | 3 | 0 |
 | 4 | 4 |
 | 5 | 1 |
 | 6 | 7 |
 | 7 | 0 |

 出现长度为 4 的循环：$$pref(n)= \begin{cases} n & n \bmod 4 = 0 \\ 1 & n \bmod 4 = 1 \\ n+1 & n \bmod 4 = 2 \\ 0 & n \bmod 4 = 3 \end{cases}$$这将每个采石场减少至$10^{16}$操作到恒定时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(\sum m_i)$|$O(1)$| 太慢了|
 | 最佳 |$O(n)$|$O(1)$| 已接受 |

 ## 算法演练

 1. 读取采石场的数量。 
2. 维护一个变量`nim_sum`， 最初`0`。 

这存储了所有采石场中所有堆的异或。 
3. 对于每个采石场，计算：$$l = x$$

$$r = x+m-1$$采石场贡献区间内的每个整数`[l, r]`。 

1. 使用前缀 xor 计算区间的 xor：$$range\_xor = pref(r) \oplus pref(l-1)$$下面的每个数字`l`出现在两个前缀异或中并抵消。 

1. 将此区间贡献异或为`nim_sum`。 
2. 处理完所有采石场后，检查`nim_sum`。 

如果它非零，则第一个玩家拥有获胜的 Nim 位置，因此打印`"tolik"`。 

否则打印`"bolik"`。 

### 为什么它有效

 正确性来自两个标准 Nim 属性。 

首先，独立堆通过异或组合。 当所有堆大小的异或非零时，第一个玩家将赢得整个游戏。 

其次，异或是自取消的：$$a \oplus a = 0$$所以：$$pref(r)\oplus pref(l-1)$$删除下面的所有数字`l`，只留下区间的异或`[l, r]`。 

这`pref(n)`公式是正确的，因为连续整数的异或每四个数字重复一次。 附加四个连续的整数总是恢复相同的模式，这会产生基于`n % 4`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def pref_xor(n):
    if n % 4 == 0:
        return n
    if n % 4 == 1:
        return 1
    if n % 4 == 2:
        return n + 1
    return 0

n = int(input())
nim_sum = 0

for _ in range(n):
    x, m = map(int, input().split())

    l = x
    r = x + m - 1

    nim_sum ^= pref_xor(r) ^ pref_xor(l - 1)

print("tolik" if nim_sum else "bolik")
```辅助函数`pref_xor(n)`计算：$$0 \oplus 1 \oplus \dots \oplus n$$在恒定时间内使用重复模 4 模式。 

对于每个采石场，代码都会转换`(x, m)`进入实际区间`[x, x+m-1]`。 这`-1`很重要。 忘记它会改变范围并破坏每个答案。 

表达式：```
pref_xor(r) ^ pref_xor(l - 1)
```在区间上提取异或的方式与前缀和提取算术和的方式完全相同。 

Python 整数自动处理上述值$2^{63}$，所以$10^{16}$限制是完全安全的。 

最终的决定符合标准 Nim 理论。 零异或意味着每个动作都可以镜像到另一个零异或状态，因此第一个玩家在最佳游戏下失败。 

## 工作示例

 ### 示例 1

 输入：```
2
2 1
3 2
```处理痕迹：

 | 采石场 | 间隔 | 区间异或 | 更新后的 nim_sum |
 | --- | --- | --- | --- |
 | (2,1) | [2,2]| 2 | 2 |
 | (3,2) | [3,4]| 7 | 5 |

 最终的异或是`5`，它是非零的。 

输出：```
tolik
```这个例子展示了不同的采石场如何通过异或简单地组合。 该算法永远不需要模拟动作。 

### 示例 2

 输入：```
1
1 3
```这些堆是：```
1 2 3
```追踪：

 | 采石场 | 间隔 | 偏好(r) | 首选项(l-1) | 区间异或 | 尼姆总和 |
 | --- | --- | --- | --- | --- | --- |
 | (1,3) | [1,3]| 0 | 0 | 0 | 0 |

 输出：```
bolik
```的确：$$1 \oplus 2 \oplus 3 = 0$$这演示了前缀异或技术背后的取消属性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 每个采石场均在恒定时间内进行处理 |
 | 空间|$O(1)$| 只存储了几个整型变量 |

 和$10^5$对于采石场来说，线性时间很容易足够快。 该算法仅对每个采石场执行少量算术和异或运算，完全在 2 秒的限制之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    def pref_xor(n):
        if n % 4 == 0:
            return n
        if n % 4 == 1:
            return 1
        if n % 4 == 2:
            return n + 1
        return 0

    n = int(input())
    nim_sum = 0

    for _ in range(n):
        x, m = map(int, input().split())

        l = x
        r = x + m - 1

        nim_sum ^= pref_xor(r) ^ pref_xor(l - 1)

    print("tolik" if nim_sum else "bolik")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.strip()

# provided sample
assert run(
"""2
2 1
3 2
""") == "tolik", "sample 1"

# minimum-size input
assert run(
"""1
1 1
""") == "tolik", "single heap"

# xor becomes zero
assert run(
"""1
1 3
""") == "bolik", "1 xor 2 xor 3 = 0"

# catches off-by-one in interval end
assert run(
"""1
5 1
""") == "tolik", "single-value interval"

# large values
assert run(
"""1
10000000000000000 2
""") == "tolik", "large integers"

# multiple ranges cancelling each other
assert run(
"""2
1 1
1 1
""") == "bolik", "same heaps cancel"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1`|`tolik`| 最小有效输入 |
 |`1 / 1 3`|`bolik`| 零异或位置 |
 |`1 / 5 1`|`tolik`| 正确的区间边界处理 |
 |`1 / 10^16 2`|`tolik`| 大整数安全 |
 |`2 / 1 1 / 1 1`|`bolik`| 跨采石场的异或取消 |

 ## 边缘情况

 一个常见的错误是错误地处理只包含一堆的采石场。 

输入：```
1
5 1
```间隔为`[5,5]`。 

该算法计算：$$pref(5)\oplus pref(4)$$使用模 4 规则：$$pref(5)=1$$

$$pref(4)=4$$所以：$$1 \oplus 4 = 5$$最终的异或非零，所以答案是`"tolik"`。 

如果我们不小心使用了`r = x + m`而不是`x + m - 1`，我们会处理`[5,6]`相反，并得到错误的答案。 

另一个微妙的情况是总异或完全取消。 

输入：```
1
1 3
```这些堆是：```
1 2 3
```该算法计算：$$pref(3)\oplus pref(0) = 0 \oplus 0 = 0$$所以输出是`"bolik"`。 

这验证了前缀异或取消逻辑。 模 4 模式的错误实现通常会在这个精确范围内失败。 

大值是另一个危险点。 

输入：```
1
10000000000000000 1
```该区间包含一个具有值的堆$10^{16}$。 

该算法仍然只执行常数时间算术：$$pref(10^{16}) \oplus pref(10^{16}-1)$$迭代不依赖于堆大小，因此即使在最大限制下，该解决方案仍然有效。
