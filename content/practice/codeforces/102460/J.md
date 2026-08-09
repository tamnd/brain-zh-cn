---
title: "CF 102460J - 自动控制机"
description: "每台机器都有一组必须全部进行测试的功能。 测试数据集可以检测这些特征的某些子集，由长度为 (n) 的二进制字符串表示。 选择多个数据集意味着将这些数据集检测到的所有特征进行并集。"
date: "2026-08-08T10:18:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102460
codeforces_index: "J"
codeforces_contest_name: "2019-2020 ICPC Asia Taipei-Hsinchu Regional Contest"
rating: 0
weight: 102460
solve_time_s: 310
verified: true
draft: false
---

[CF 102460J - 自动控制机](https://codeforces.com/problemset/problem/102460/J)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每台机器都有一组必须全部进行测试的功能。 测试数据集可以检测这些特征的某些子集，由长度为二进制的字符串表示\(n\)。 选择多个数据集意味着将这些数据集检测到的所有特征进行并集。 任务是找到其并集包含每个特征的最小数量的数据集。 如果某些特征从未被任何数据集检测到，那么答案是\(-1\)。 

约束是故意不对称的。 特征可以有多达 500 个，这对于特征的子集来说太多了，因为\(2^{500}\)是完全不可行的。 另一方面，最多有 15 个测试数据集。 这使得\(2^m\), 至多\(2^{15}=32768\)，小到足以枚举每台机器。 机器的数量也最多为 10 台，因此即使处理每台机器的所有子集也很容易管理。 

粗心的实施仍然可能在一些边界上失败。 考虑一个具有无法对其进行测试的数据集的单个功能：```text
1
1 1
0
```正确答案是`-1`。 将答案初始化为零并仅在找到解决方案时减少答案的解决方案可能会错误地打印零。 

相反的情况也很有用：```text
1
1 1
1
```正确答案是`1`，不为零。 空子集不包含任何特征，因此决不能将其视为有效的解决方案。 

重复的数据集不会提供任何特殊的优势。 例如：```text
1
4 3
1111
1111
1111
```答案是`1`，因为一个数据集已经涵盖了所有内容。 计算不同覆盖模式而不是选定数据集的解决方案仍然可以正确处理这种情况，但意外需要每个选定数据集不同覆盖范围的算法可能会失败。 

最后，一个特征只能通过组合多个数据集来覆盖。 例如：```text
1
3 2
100
011
```答案是`2`。 仅检查某个单独的数据集是否涵盖所有功能会错误地报告`-1`。 

官方样本包含五台机器并有输出`1, 2, 4, 3, -1`。 完整的二进制字符串存在于原始竞赛声明中。 引用turn2view0

 ## 方法

 直接蛮力方法是考虑每个子集\(m\)测试数据集。 对于每个子集，扫描数据集集合在\(2^m\)子集。 

如果覆盖率简单地表示为布尔数组，则处理一个子集可能需要 \(O(mn)\) 时间。 在最坏的情况下，这给出\[
O(2^m mn).
\]和\(m=15\)和\(n=500\)，大致就是\(32768 \times 15 \times 500\)，或者每台机器大约 2.46 亿次基本特征检查。 在两秒的限制下，Python 几乎没有空间。 

关键的观察是，小维度是数据集的数量，而不是特征的数量。 我们应该枚举数据集的子集，但我们应该紧凑地表示所覆盖的特征集。 

Python 整数是任意精度的位集。 我们可以将每个二进制字符串转换为一个整数，其中位\(j\)代表是否有特征\(j\)被覆盖。 组合数据集只需按位或即可。 500 个特征的联合在内部只适合少数机器字，Python 在优化的本机代码中执行 OR 运算。 

还有一项更有用的改进。 考虑子集时，删除一个选定的数据集并重新使用较小子集的覆盖范围。 如果`mask`是当前子集并且`bit`是它的最低设置位，那么```text
coverage[mask] = coverage[mask without bit] | dataset[bit]
```因此，每个子集仅需要一次整数或运算，而不是从所有选定的数据集重建其并集。 

蛮力方法之所以有效，是因为必须考虑每种可能的选择，但它会失败，因为它会重复重新计算相同的部分并集。 的小值\(m\)让我们保留\(2^m\)搜索空间，而位集和增量子集构造使每个子集的工作量很小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 蛮力 | \(O(2^m mn)\) | \(O(n)\) | Python 太慢 |
 | 最佳 | \(O(2^m \lceil n/w\rceil)\) | \(O(2^m \lceil n/w\rceil)\) | 已接受 |

 这里\(w\)是位集表示内部使用的机器字大小。 自从\(n\le500\)，对于这个问题来说，它实际上是一个小常数。 

## 算法演练

 1. 将每个数据集的二进制字符串转换为整数。 少量\(j\)恰好在数据集时设置\(j\)可以测试相应的功能。 使用整数意味着将两组测试特征合并为单个按位或。 

2. 构建`full = (1 << n) - 1`。 这个整数有全部\(n\)特征位设置，因此当其覆盖整数等于时，集合准确地覆盖每个特征`full`。 

3.分配数组`coverage`尺寸的\(2^m\)。 入口`coverage[mask]`存储由表示的子集选择的所有数据集的并集`mask`。 空子集有`coverage[0] = 0`。 

4. 枚举每个非空子集`mask`。 提取其最低设置位`mask & -mask`。 该位的位置标识属于该子集的一个数据集。 

5. 从子集中删除该数据集以获得`previous = mask ^ bit`。 那么当前子集的覆盖范围是`coverage[previous] | datasets[index]`。 这是核心重用步骤，因为较小的子集已被处理。 

6. 每当最终的覆盖范围等于`full`, 计算`mask.bit_count()`并用它来更新最小答案。 检查每个子集，因此保证找到最小的有效子集。 

7. 如果没有子集达到`full`， 打印`-1`。 否则打印找到的最小数量的选定数据集。 

### 为什么它有效

 不变量是在处理子集之后`mask`,`coverage[mask]`正是由选择的所有数据集的并集`mask`。 这最初适用于空子集。 对于任何非空子集，删除一个选定的数据集会得到一个较小的子集，其覆盖范围已经正确，并且对删除的数据集进行“或”操作会准确地添加它可以测试的功能。 因此，每个子集都得到其准确的覆盖范围。 由于该算法检查每个可能的子集并精确接受覆盖范围包含每个特征的子集，因此记录的最小人口数正是所需的最小数据集数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    T = int(input())
    answers = []

    for _ in range(T):
        n, m = map(int, input().split())

        datasets = []
        for _ in range(m):
            datasets.append(int(input().strip(), 2))

        full = (1 << n) - 1
        total_masks = 1 << m

        coverage = [0] * total_masks
        answer = m + 1

        for mask in range(1, total_masks):
            bit = mask & -mask
            index = bit.bit_length() - 1
            previous = mask ^ bit

            coverage[mask] = coverage[previous] | datasets[index]

            if coverage[mask] == full:
                count = mask.bit_count()
                if count < answer:
                    answer = count

        answers.append(str(answer if answer <= m else -1))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```输入字符串转换为`int(string, 2)`。 最左边的字符成为高阶位，但这并不重要，因为我们只关心每个位置是否在所有数据集中一致地覆盖。`full = (1 << n) - 1`准确地创造\(n\)一位。 由于每个数据集都有准确的\(n\)字符，位置上方不能出现无关位\(n-1\)。 

表达式`mask & -mask`隔离最低的选定数据集。`bit.bit_length() - 1`将该隔离位转换为相应的从零开始的数据集索引。`mask ^ bit`删除它，因为该位保证被设置`mask`。 

数组`coverage`有\(2^m\)条目，包括空子集。 开始枚举`1`避免将空子集视为解决方案。 自从\(n>0\)，空子集永远无法覆盖`full`反正。 

Python 整数不会溢出，因此特征计数为 500 不需要特殊的数字处理。 昂贵的工作是通过整数 OR 运算而不是对各个特征进行 Python 级循环来执行的。 

## 工作示例

 官方样例是从这台机器开始的：```text
3 3
100
011
111
```共有三个数据集和三个特征。 完整的样本给了这台机器答案`1`。 引用turn2view0

 | 面膜| 选定的数据集 | 覆盖范围| 计数 | 最佳|
 |---:|---|---|---:|---:|
 | 000 | 000 无 | 000 | 000 0 | 无效 |
 | 001| 数据集 1 | 100 | 100 1 | 无效 |
 | 010| 数据集 2 | 011| 1 | 无效 |
 | 011| 数据集 1、2 | 111 | 111 2 | 2 |
 | 100 | 100 数据集 3 | 111 | 111 1 | 1 |

 子集`011`证明所有三个特征对于两个数据集都是可能的。 后面的子集`100`表明仅第三个数据集就已经涵盖了所有内容，因此最优值降至`1`。 

官方样本中的第五台机器是：```text
2 1
01
```只有一个数据集，并且仅测试第二个特征。 第一个功能无法测试，所以答案是`-1`。 引用turn2view0

 | 面膜| 选定的数据集 | 覆盖范围| 计数 | 最佳|
 |---:|---|---|---:|---:|
 | 0 | 无 | 00 | 00 0 | 无效 |
 | 1 | 数据集 1 | 01 | 1 | 无效 |

 没有子集产生`11`，因此算法以其初始哨兵值结束并打印`-1`。 这说明了为什么必须将不可能性与寻找最小值分开处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 |---|---|---|
 | 时间 | \(O(T2^m\lceil n/w\rceil)\) | 每个\(2^m\)子集最多执行一次按位或和一位计数 |
 | 空间| \(O(2^m\lceil n/w\rceil)\) | 覆盖范围数组为每个数据集子集存储一个位集 |

 和\(m\le15\)，每台机器最多有 32768 个子集。 由于只有 500 个特征，每个位集都非常小。 即使在所有 10 台机器上，这也完全在规定的内存限制内，并且操作比简单的 \(O(2^m mn)\) 实现小得多。 

## 测试用例

 以下测试工具使用相同的`solve`作为提交的解决方案。 官方样本与竞赛声明中发布的完全一致。 引用turn2view0```python
import sys
import io

def solve():
    input = sys.stdin.readline

    T = int(input())
    answers = []

   
        answer = m + 1

        for mask in range(1, total_masks):
            bit = mask & -mask
            index = bit.bit_length() - 1
            previous = mask ^ bit

            coverage[mask] = coverage[previous] | datasets[index]

            if coverage[mask] == full:
                answer = min(answer, mask.bit_count())

        answers.append(str(answer if answer <= m else -1))

    sys.stdout.write("\n".join(answers))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Official sample
sample = """\
5
3 3
100
011
111
5 6
10000
01001
01110
00111
10110
00101
6 7
000010
011000
100100
001000
000010
010000
110001
7 6
1001001
1001000
0001101
0010110
0110011
0100001
2 1
01
"""

assert run(sample) == """\
1
2
4
3
-1
""".strip(), "official sample"

# Minimum-size solvable case
assert run("""\
1
1 1
1
""") == "1", "single feature covered by one dataset"

# Minimum-size impossible case
assert run("""\
1
1 1
0
""") == "-1", "single feature is never covered"

# All datasets are identical, but one already covers everything
assert run("""\
1
4 3
1111
1111
1111
""") == "1", "duplicate full-coverage datasets"

# Coverage requires combining datasets
assert run("""\
1
3 2
100
011
""") == "2", "two datasets are necessary"

# Maximum m, with every dataset identical
max_case = "1\n1 15\n" + "1\n" * 15
assert run(max_case) == "1", "maximum number of datasets"

# Maximum n, one dataset covers every feature
max_n_case = "1\n500 1\n" + "1" * 500 + "\n"
assert run(max_n_case) == "1", "maximum number of features"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---:|---|
 |`1 / 1 1 / 1`|`1`| 最小可解实例 |
 |`1 / 1 1 / 0`|`-1`| 最小不可能实例 |
 | 三个相同`1111`数据集|`1`| 重复数据集和最小选择 |
 |`100`和`011`|`2`| 需要组合数据集的覆盖范围 |
 | 一项特征和 15 个相同的数据集 |`1`| 最大限度\(m\)边界|
 | 一个数据集包含 500 个 |`1`| 最大限度\(n\)边界|

 ## 边缘情况

 对于单一特征可解决的情况```text
1
1 1
1
```完整的面具是`1`。 空子集有覆盖范围`0`，而子集`1`有覆盖范围`1`，所以答案就变成了`1`。 该实现绝不会意外地接受空子集。 

对于单一特征不可能的情况```text
1
1 1
0
```全面面膜又来了`1`，但唯一的非空子集具有覆盖范围`0`。 没有子集达到完整掩码，因此哨兵仍然存在`m + 1`输出是`-1`。 

对于重复的全覆盖数据集```text
1
4 3
1111
1111
1111
```每个数据集已经等于`full`。 第一个单数据集子集达到完全覆盖并给出答案`1`。 额外的相同数据集无法改进它，因为没有有效的解决方案可以使用少于一个数据集。 

对于需要组合的情况，```text
1
3 2
100
011
```第一个数据集涵盖特征 1，第二个数据集涵盖特征 2 和 3，并且两个子集都没有达到`111`。 包含两个数据集的子集产生`111`并有人口数`2`，给出正确答案。 

对于最大数据集数量，\(m=15\)，该算法恰好枚举了 32768 个子集。 这是输入允许的最大搜索空间。 子集表示使用 15 位，因此在提取最低设置位或对所选数据集进行计数时不需要特殊处理。 

对于最大特征数，\(n=500\),`full`包含 500 个 1 位，每个数据集变成一个 500 位的 Python 整数。 Python 的任意精度整数直接处理这个问题，因此不需要管理固定宽度的溢出边界。
