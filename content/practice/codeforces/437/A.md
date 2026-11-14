---
title: "CF 437A - 孩子和家庭作业"
description: "任务是模拟孩子如何在多项选择题中选择答案，该题有四个选项，标记为 A 到 D。每个选项都有文字描述。"
date: "2026-06-07T03:07:03+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 437
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 250 (Div. 2)"
rating: 1300
weight: 437
solve_time_s: 67
verified: true
draft: false
---

[CF 437A - 孩子和家庭作业](https://codeforces.com/problemset/problem/437/A)

 **评分：** 1300
 **标签：** 实施
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是模拟孩子如何在多项选择题中选择答案，该题有四个选项，标记为 A 到 D。每个选项都有文字描述。 如果一个选择的描述至少比其他所有选择短两倍，或者至少比其他所有选择长两倍，孩子就会认为该选择“很棒”。 如果只有一个选择很好，孩子就会选择它。 否则，子项默认为 C。 

输入由四行组成。 每行都以“A”等标签开头。 或“B”。 接下来是描述。 描述是我们测量长度的部分； 标签本身不计算在内。 输出是代表孩子选择的单个字母。 

描述的最大长度为 100 个字符。 只有四个选项，不存在时间复杂度问题的风险。 即使所有对之间的强力比较也可以忽略不计。 挑战在于根据规则正确识别“伟大”的选择。 

当多个选项满足“很好”条件时，就会出现边缘情况。 例如，如果一个选项比所有其他选项短两倍，而另一个选项比所有其他选项长两倍，则不存在唯一的最佳选择，孩子应该选择 C。另一种微妙的边缘情况是，当描述的长度非常接近，但不是严格两倍短或两倍长时 - 比较必须正确使用整数除法或精确浮点比较。 

## 方法

 暴力方法会将每个选择与所有其他选择进行比较。 对于每个选项，计算其长度，然后检查它是否至少比所有其他选项短两倍，或至少比所有其他选项长两倍。 对于四个选项，这需要每个选项进行六次比较，这是微不足道的。 这种方法是正确的并且足够快，因为输入大小很小。 

为了清晰起见，关键的见解是我们只需要计算一次长度，然后单独检查每个选项与其他选项。 由于只有四种选择，因此不需要排序或高级数据结构。 问题主要在于仔细实施：正确提取长度，应用“短或长的两倍”条件，以及处理平局打破规则。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 在这个问题中，由于输入大小恒定较小，暴力法和最优法本质上是相同的。 

## 算法演练

 1. 读取四行输入。 对于每一行，去掉前两个字符（标签和点）并计算剩余字符串的长度。 将这些长度存储在与选项 A 到 D 相对应的数组中。 
2. 初始化一个空列表来跟踪哪些选择“很棒”。 
3. 对于每个选项，将其长度与其他三个进行比较。 如果其长度至少是其他三个长度中每个长度的两倍或至多是其他三个长度中每个长度的一半，则该选择是不错的。 使用乘以 2 的严格比较以避免浮点错误。 
4. 如果恰好有一个选项被标记为优秀，则打印其标签。 否则，打印“C”。 

为什么有效：通过迭代每个选择并使用精确的算术将其与其他选择进行检查，我们保证检测到所有且仅“伟大”的选择。 由于输入大小固定为 4，因此不能忽略任何选择，并且可以正确应用平局打破规则。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

choices = ['A', 'B', 'C', 'D']
lengths = []

for _ in range(4):
    line = input().strip()
    # ignore the first two characters (label and dot)
    desc_len = len(line[2:])
    lengths.append(desc_len)

great = []

for i in range(4):
    smaller = all(lengths[i] * 2 <= lengths[j] for j in range(4) if j != i)
    larger = all(lengths[i] >= 2 * lengths[j] for j in range(4) if j != i)
    if smaller or larger:
        great.append(choices[i])

if len(great) == 1:
    print(great[0])
else:
    print('C')
```我们首先将选择映射到长度，确保排除标签。 然后我们使用检查每个选择`all()`跨越其他三个，使比较精确并避免意外的整数除法问题。 最终的选择逻辑很简单：如果一个很好，就选；如果没有，就选一个。 否则默认为 C。 

## 工作示例

 **样品1**

 输入长度：A=39、B=35、C=37、D=15

 | 选择| 长度 | 比其他人小两倍？ | 比其他人大两倍？ | 伟大的？ |
 | --- | --- | --- | --- | --- |
 | 一个 | 39 | 39 假| 假| 假|
 | 乙| 35 | 35 假| 假| 假|
 | C | 37 | 37 假| 假| 假|
 | d | 15 | 15 真实| 假| 真实|

 该表证实 D 是唯一的最佳选择。 输出：D

 **样品2**

 输入长度：A=3、B=5、C=4、D=6

 | 选择| 长度 | 比其他人小两倍？ | 比其他人大两倍？ | 伟大的？ |
 | --- | --- | --- | --- | --- |
 | 一个 | 3 | 假| 假| 假|
 | 乙| 5 | 假| 假| 假|
 | C | 4 | 假| 假| 假|
 | d | 6 | 假| 假| 假|

 没有独特的绝佳选择。 输出：C

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 四种选择和不断的比较|
 | 空间| O(1) | O(1) | 存储四种长度和一小部分不错的选择 |

 该解决方案非常轻量级，完全在 1 秒时间限制和 256 MB 内存限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    choices = ['A', 'B', 'C', 'D']
    lengths = []
    for _ in range(4):
        line = input().strip()
        lengths.append(len(line[2:]))
    great = []
    for i in range(4):
        smaller = all(lengths[i] * 2 <= lengths[j] for j in range(4) if j != i)
        larger = all(lengths[i] >= 2 * lengths[j] for j in range(4) if j != i)
        if smaller or larger:
            great.append(choices[i])
    if len(great) == 1:
        return great[0]
    return 'C'

# provided samples
assert run("A.VFleaKing_is_the_author_of_this_problem\nB.Picks_is_the_author_of_this_problem\nC.Picking_is_the_author_of_this_problem\nD.Ftiasch_is_cute\n") == "D"
assert run("A.Ab\nB.Abc\nC.Abcd\nD.Abcde\n") == "C"

# custom cases
assert run("A.A\nB.AAA\nC.AAA\nD.AAA\n") == "A"  # A is twice shorter than all
assert run("A.AAA\nB.A\nC.A\nD.A\n") == "A"       # A is twice longer than all
assert run("A.AAA\nB.AA\nC.AA\nD.AA\n") == "C"    # No unique great
assert run("A.A\nB.A\nC.A\nD.A\n") == "C"        # All equal
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | A.A\nB.AAA\nC.AAA\nD.AAA | 一个 | 独特的最短选择|
 | A.AAA\nB.A\nC.A\nD.A | 一个 | 独特的最长选择 |
 | A.AAA\nB.AA\nC.AA\nD.AA | C | 多个近乎完美的选择，应该默认 |
 | A.A\nB.A\nC.A\nD.A | C | 长度均等，没有好的选择 |

 ## 边缘情况

 当所有选择具有相同的长度时，算法将每个选择的较小和较大的检查都评估为错误。 没有找到很好的选择，因此它完全按照要求打印 C。 例如，A=1、B=1、C=1、D=1，则输出为 C。 

如果一个选项恰好是其他选项的两倍，例如长度 [2,5,5,5]，则 A 满足较小的条件，因为对于所有其他选项，2*2 <= 5，将 A 标记为伟大。 其余检查均失败，因此 A 被正确选择。 

如果两个选项都满足最佳条件，例如长度 [2,4,1,2]，则最佳选择列表的长度大于 1。 然后算法打印 C，匹配平局决胜规则。
