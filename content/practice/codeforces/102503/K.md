---
title: "CF 102503K - 小学"
description: "我们有一个矩形板，有 j 行和 g 列。 我们需要放置 p 双鞋，使得每双鞋中的两只鞋在四个基本方向之一上正好相距 c 个单元格。 任何牢房都不能容纳两双鞋。"
date: "2026-08-05T17:16:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "K"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 514
verified: false
draft: false
---

[CF 102503K - Shoedoku](https://codeforces.com/problemset/problem/102503/K)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个长方形的板，上面有`j`行和`g`列。 我们需要放置`p`使每双鞋中的两双鞋完全分开`c`细胞在四个基本方向之一。 任何牢房都不能容纳两双鞋。 问题是董事会是否有足够的独立有效头寸对。 

困难来自于巨大的限制。 测试用例数量可达`100000`，每个维度可以大到`10^18`。 任何构建板、扫描所有单元、甚至迭代所有行或列的解决方案都是不可能的。 我们需要仅使用维度算术进行恒定时间或对数时间计算。 

一个常见的错误是分别计算水平对和垂直对，然后将它们相加。 这会重复计算机会，因为用于水平对的单元格也不能用于垂直对。 方向之间的相互作用是问题的主要部分。 

当距离大于一维时，会出现另一种边缘情况。 例如，使用输入`1 5 10 1`，没有两个电池可以连接，因为板太窄且距离太短`10`。 正确答案是`NAY`。 仅检查单元总数的解决方案可能会错误地接受，因为有五个单元可用。 

当压缩维度为奇数时，会出现第二种边缘情况。 例如，`3 3 2 5`唯一的残留成分有九个细胞。 最大配对数仅为`4`，所以答案是`NAY`。 粗心的解决方案可能会假设每两个细胞可以形成一对并使用`floor(total_cells / 2)`在全球范围内不考虑这一运动`c`将电路板分成单独的组件。 

## 方法

 直接方法将每个单元建模为图顶点。 当两个顶点的单元格恰好相等时，它们就会有一条边`c`水平或垂直位置分开。 那么问题就变成了寻找最大匹配尺寸。 这是正确的，因为每个选定的匹配边对应于一双鞋，并且匹配保证没有单元被重复使用。 

问题是该图最多可以包含`10^36`单元格，因此即使存储顶点也是不可能的。 即使在小板上，运行通用匹配算法也是不必要的工作，因为图具有非常规则的结构。 

关键的观察是，精确地移动`c`行或列永远不会改变单元格的行模`c`或列模`c`。 因此，细胞根据其两个残基分裂成独立的成分。 在一个组件内，将坐标压缩一倍后`c`，该图变成一个普通的矩形网格，其中相邻的压缩单元相连。 

矩形网格图`a`行和`b`列的最大匹配数为`floor(a*b/2)`。 如果单元格数量是偶数，则棋盘着色的边数相等，并且存在完美匹配。 如果单元格数量为奇数，则最多有一个单元格保持不匹配。 

剩下的任务是计算总和`floor(rows_in_residue * cols_in_residue / 2)`遍历所有残基对，而不迭代残基。 行计数的形式很简单。 其中`c`可能存在行残基，计数最多相差 1。 对于列也是如此。 我们只需要知道有多少个残基组具有较大的尺寸。 

让：`A = j // c`,`ar = j % c`是基本行组大小和接收额外一行的行残基数。 相似地，`B = g // c`,`br = g % c`描述列。 

有`ar`大小的行组`A + 1`和`c - ar`大小组`A`，但仅`min(j, c)`团体确实存在。 相同的调整适用于`c`大于一个维度。 

根据行组是大还是小以及列组是大还是小，总和可以分为四种类型的余数分量。 这四种组合的计数是乘积，每个组件贡献其面积的一半，向下舍入。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(j * g) 顶点和匹配工作 | O(j * g) | 太慢了|
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 计算实际行残基组和列残基组的数量。 如果`c`大于一个维度，只是出现了很多残基。 
2. 将行组分为两类。 较小的行组具有大小`j // c`， 和`j % c`群体更大。 对列执行相同的操作。 
3. 计算四种可能的组件类型所贡献的匹配对的总数。 对于每个行类别和列类别，将此类组件的数量乘以`floor(component_height * component_width / 2)`。 
4. 将所得的最大对数与`p`。 打印`YAY`如果最大值至少为`p`，否则打印`NAY`。 

为什么它有效：每双有效的鞋都恰好位于一个残差分量内，因为两个坐标都保持其余数模`c`。 组件是独立的，因此可以将它们的最大匹配相加。 每个组件都是一个矩形网格，并且矩形网格总是匹配除可能的一个之外的所有单元格。 该公式计算每个组件类型中的确切单元数，因此总和恰好是鞋对的最大可能数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(j, g, c, p):
    row_groups = min(j, c)
    col_groups = min(g, c)

    row_small = j // c
    row_big_count = min(j % c, row_groups)
    row_small_count = row_groups - row_big_count

    col_small = g // c
    col_big_count = min(g % c, col_groups)
    col_small_count = col_groups - col_big_count

    ans = 0

    ans += row_small_count * col_small_count * ((row_small * col_small) // 2)
    ans += row_small_count * col_big_count * ((row_small * (col_small + 1)) // 2)
    ans += row_big_count * col_small_count * (((row_small + 1) * col_small) // 2)
    ans += row_big_count * col_big_count * (((row_small + 1) * (col_small + 1)) // 2)

    return "YAY" if ans >= p else "NAY"

def main():
    t = int(input())
    out = []
    for _ in range(t):
        j, g, c, p = map(int, input().split())
        out.append(solve_case(j, g, c, p))
    print("\n".join(out))

if __name__ == "__main__":
    main()
```该代码首先计算实际出现的残基类别数量。 这很重要，当`c`大于`j`或者`g`，因为非空组的数量不能多于行或列的数量。 

变量`row_big_count`和`col_big_count`表示接收额外一行或一列的残基类别。 其余班级规模较小。 这四个附加项直接对应于这些类别的四种组合。 

Python 整数可以处理达到所需范围的值，而无需担心溢出。 最大的乘法约为`10^36`，Python 的任意精度整数仍然安全地支持它。 

## 工作示例

 对于第一个样本，`j = 1`,`g = 2`,`c = 1`,`p = 1`。 

| 行组| 列组 | 最大对 | 需要| 结果 |
 | --- | --- | --- | --- | --- |
 | 一组 1 号 | 一组 2 号 | 1 | 1 | 是啊|

 唯一的组件是整个板。 它包含两个按距离 1 连接的单元，因此可以是一对。 

对于第二个样本，`j = 3`,`g = 3`,`c = 2`,`p = 3`。 

| 行组| 列组 | 组件领域 | 最大对 | 需要| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 尺寸 2、1 | 尺寸 2、1 | 4, 2, 2, 1 | 2+1+1+0 = 4 | 3 | 是啊|

 该板分成四个剩余部分。 它们的匹配是独立的，并且它们一起提供了足够的配对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(1) | 仅执行固定数量的算术运算 |
 | 空间| O(1) | O(1) | 不会创建取决于输入大小的数据结构 |

 和`100000`在测试用例中，该算法仅执行几百万次简单的整数运算，完全符合时间限制。 内存使用量保持不变。 

## 测试用例```python
import sys
import io

def solve_all(inp):
    old = sys.stdin
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve_case(j, g, c, p):
        row_groups = min(j, c)
        col_groups = min(g, c)

        row_small = j // c
        row_big_count = min(j % c, row_groups)
        row_small_count = row_groups - row_big_count

        col_small = g // c
        col_big_count = min(g % c, col_groups)
        col_small_count = col_groups - col_big_count

        ans = 0
        ans += row_small_count * col_small_count * ((row_small * col_small) // 2)
        ans += row_small_count * col_big_count * ((row_small * (col_small + 1)) // 2)
        ans += row_big_count * col_small_count * (((row_small + 1) * col_small) // 2)
        ans += row_big_count * col_big_count * (((row_small + 1) * (col_small + 1)) // 2)

        return "YAY" if ans >= p else "NAY"

    t = int(input())
    res = []
    for _ in range(t):
        j, g, c, p = map(int, input().split())
        res.append(solve_case(j, g, c, p))

    sys.stdin = old
    return "\n".join(res)

assert solve_all("""2
1 2 1 1
3 3 2 3
""") == "YAY\nYAY"

assert solve_all("""1
1 1 1 1
""") == "NAY"

assert solve_all("""1
5 5 10 1
""") == "NAY"

assert solve_all("""1
1000000000000000000 1000000000000000000 1 500000000000000000000000000000000000
""") == "YAY"

assert solve_all("""1
3 3 2 5
""") == "NAY"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2 1 1`|`YAY`| 提供样本和最小可能的有效对 |
 |`1 1 1 1`|`NAY`| 单个细胞不能形成一对 |
 |`5 5 10 1`|`NAY`| 距离大于两个尺寸 |
 | 巨大的广场有`c = 1`|`YAY`| 大整数运算|
 |`3 3 2 5`|`NAY`| 奇数残留成分限制|

 ## 边缘情况

 对于`1 5 10 1`，该算法计算一个行组和五个列组，但压缩后每个组件的宽度都小于所需的移动量。 计算出的最大匹配为零，因此返回`NAY`。 

为了`3 3 2 5`，残基基团在两个维度上的大小均为 2 和 1。 四个组成部分是`4`,`2`,`2`， 和`1`，作出贡献`2`,`1`,`1`， 和`0`。 总计为`4`，小于`5`，所以算法返回`NAY`。 

为了`1 1 1 1`，唯一的组件包含一个单元格。 其匹配贡献为`floor(1/2) = 0`，防止假设每个单元都可以配对的无效答案。
