---
title: "CF 102501E - 像素"
description: "我们有一个矩形二进制网格。 单元格要么是黑色的，要么是白色的，我们需要选择一组按下开关的单元格。 按一个开关即可切换该单元及其四个正交邻居。"
date: "2026-08-06T18:55:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102501
codeforces_index: "E"
codeforces_contest_name: "2019-2020 ICPC Southwestern European Regional Programming Contest (SWERC 2019-20)"
rating: 0
weight: 102501
solve_time_s: 60
verified: true
draft: false
---

[CF 102501E - 像素](https://codeforces.com/problemset/problem/102501/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个矩形二进制网格。 单元格要么是黑色的，要么是白色的，我们需要选择一组按下开关的单元格。 按一个开关即可切换该单元及其四个正交邻居。 任务是输出一组有效的按下开关或证明不存在这样的一组。 

输入给出了每个单元所需的最终状态。 输出是另一个相同大小的网格，其中`P`表示相应的开关被按下并且`A`表示没有被按下。 

单元总数最多为 100000 个。对所有单元进行一般的高斯消元法需要一个具有 100000 个变量的矩阵，这远远超出了我们的处理能力。 该解决方案需要利用矩形结构，而不是将每个单元格视为不相关的变量。 重要的观察是，当面积以 100000 为边界时，矩形的较小边最多约为 316，因此较小维度上的线性系统是可行的。 

在一些小情况下，粗心的解决方案会失败。 对于单行，按下一个单元格只会影响该行中的相邻单元格，因此用于较大网格的垂直推理必须仍然有效。 例如：```
1 2
B W
```当按下任一开关时，两个单元格总是一起变化，所以答案是`IMPOSSIBLE`。 

第二个陷阱是忘记第一行或最后一行的邻居较少。 例如：```
2 1
B
B
```按顶部开关会切换两个单元格，因此按顶部单元格会产生所需的结果。 假设每个细胞有四个邻居的解决方案将建立错误的方程。 

## 方法

 一种直接的方法是将每个单元格视为变量并在 GF(2) 上构建线性系统。 每个变量表示是否按下开关。 每个方程描述了最终单元格应该是黑色还是白色。 这是正确的，因为切换相当于模 2 加法。 然而，该矩阵将包含多达 100000 个变量，使得普通消除太慢。 最坏的情况将需要大约 10 次 15 位操作。 

网格结构提供了更好的路线。 如果我们决定按下一行中的哪些开关，则可以强制执行所有后续行。 这是熄灯问题中使用的经典追逐技术。 唯一未知的部分成为第一行。 由于我们可以转置网格，因此列数始终可以成为较小的维度。 第一行最多包含 316 个变量。 

剩下的问题是一个小型线性系统。 我们使用第一行的每个可能的基向量模拟一次追逐，以了解每个第一行变量如何影响最后一行。 然后高斯消元法找到所需的第一行压机。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2 分钟(K,L) ) | O(吉隆坡) | 太慢了|
 | 最佳 | O(KL·min(K,L)) | O(KL·min(K,L)) | O(吉隆坡) | 已接受 |

 ## 算法演练

 1. 如果行数大于列数，则转置网格。 这使得第一行很小，这是唯一可以通过高斯消去法解决的部分。 
2. 将每一行表示为位掩码。 目标网格转换为二进制矩阵，其中`1`意思是黑色。 
3. 定义追逐功能。 给定第一行按压，确定下一行，因为行`i`必须通过选择行来修复`i + 1`。 公式为：

 x i+1 ​ =d i ​ ⊕T(x i ​ )⊕x i−1 ​

 其中 T 与它的左、右邻居一起切换一行。 

1. 在第一行为空的情况下运行追逐程序。 最后一行中剩余的差值成为最终方程的常数部分。 
2. 对第一行中的每个位运行一次追踪。 由此产生的最后一行差异形成线性系统的列。 
3. 通过 GF(2) 上的高斯消去法求解线性系统。 如果出现矛盾，则无法创建图片。 
4. 使用已解决的第一行，最后运行一次走灯程序，并输出压力。 如果网格被调换，则将答案调回原来的位置。 

追逐背后的不变性是在处理行之后`i`，上面的所有行都已经正确，并且永远不会再改变。 每个可能的解决方案都必须有一些第一行按下，并且追逐准确地生成由第一行确定的解决方案。 最终的线性系统检查哪一行使最后一行正确，因此找到的解决方案始终有效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def toggle_row(x, m):
    return x ^ ((x << 1) & ((1 << m) - 1)) ^ (x >> 1)

def chase(first, target, n, m):
    press = [0] * n
    press[0] = first
    for i in range(n - 1):
        cur = target[i] ^ press[i - 1] if i else target[i]
        press[i + 1] = cur ^ toggle_row(press[i], m)
    return press

def solve_system(cols, rhs, n):
    rows = []
    for i in range(n):
        mask = 0
        for j in range(n):
            if (cols[j] >> i) & 1:
                mask |= 1 << j
        if (rhs >> i) & 1:
            mask |= 1 << n
        rows.append(mask)

    pivot = 0
    where = [-1] * n
    for col in range(n):
        found = -1
        for r in range(pivot, n):
            if (rows[r] >> col) & 1:
                found = r
                break
        if found == -1:
            continue
        rows[pivot], rows[found] = rows[found], rows[pivot]
        where[col] = pivot
        for r in range(n):
            if r != pivot and ((rows[r] >> col) & 1):
                rows[r] ^= rows[pivot]
        pivot += 1

    for r in range(n):
        if rows[r] == (1 << n):
            return None

    ans = 0
    for i in range(n):
        if where[i] != -1 and ((rows[where[i]] >> n) & 1):
            ans |= 1 << i
    return ans

def main():
    k, l = map(int, input().split())
    a = [[1 if x == 'B' else 0 for x in input().split()] for _ in range(k)]

    transposed = False
    if k < l:
        a = [list(x) for x in zip(*a)]
        k, l = l, k
        transposed = True

    target = []
    for row in a:
        mask = 0
        for j, x in enumerate(row):
            if x:
                mask |= 1 << j
        target.append(mask)

    base = chase(0, target, k, l)
    rhs = target[-1] ^ (base[-2] if k > 1 else 0) ^ toggle_row(base[-1], l)

    cols = []
    for i in range(l):
        cur = chase(1 << i, target, k, l)
        cols.append(toggle_row(cur[-1], l) ^ (cur[-2] if k > 1 else 0) ^ rhs)

    first = solve_system(cols, rhs, l)
    if first is None:
        print("IMPOSSIBLE")
        return

    ans = chase(first, target, k, l)
    out = [['P' if (ans[i] >> j) & 1 else 'A' for j in range(l)] for i in range(k)]

    if transposed:
        out = [list(x) for x in zip(*out)]

    print('\n'.join(' '.join(row) for row in out))

if __name__ == "__main__":
    main()
```该实现将每一行存储为整数位掩码。 这使得水平邻居操作成为一些位操作，而不是迭代单元。 chase 函数遵循上述相同的不变量：一旦传递了一行，它就被永久固定。 

高斯消去法使用整数作为位集。 每行中额外的最高位存储右侧，因此异或行对 GF(2) 执行消除。 转置步骤至关重要，因为它可以使最终系统中的变量数量保持较小。 

## 工作示例

 对于第一个样本：

 | 步骤| 第一行选择 | 最后一行要求 | 结果 |
 | --- | --- | --- | --- |
 | 初始| 没有选择印刷机| 两个细胞必须变得不同| 不可能|
 | 消除| 不存在一致的分配 | 发现矛盾 |`IMPOSSIBLE`|

 矛盾的出现是因为两个单元总是一起切换，因此目标状态无法分离。 

举一个有效的小例子：```
2 1
B
B
```| 步骤| 当前行按 | 下一行按 | 状态|
 | --- | --- | --- | --- |
 | 开始|`0`|`1`| 顶行固定|
 | 完成 |`1`| 无 | 两个细胞都变黑|

 追踪正确地选择了唯一可以创建所需对的开关。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(KL·min(K,L)) | O(KL·min(K,L)) | 每个可能的第一行位都需要一个追踪，并且追踪触及每个单元 |
 | 空间| O(吉隆坡) | 网格和答案已存储 |

 由于网格的较小边最多为 316，因此即使单元数达到 100000，倍增因子仍然很小。 

## 测试用例```python
# The submitted program is read from stdin, so these examples are intended
# to be run manually with the solution above.

cases = [
    (
        "1 2\nB W\n",
        "IMPOSSIBLE"
    ),
    (
        "1 1\nB\n",
        "P"
    ),
    (
        "2 1\nB\nB\n",
        "P\nA"
    ),
    (
        "1 3\nB B B\n",
        "A P A"
    )
]

for inp, expected in cases:
    print("Input:")
    print(inp)
    print("Expected contains:")
    print(expected)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2 / B W`|`IMPOSSIBLE`| 不可满足的单行情况 |
 |`1 1 / B`| 任意按一下 | 尽可能最小的网格 |
 |`2 1 / B B`| 一台立式压力机| 边界处理|
 |`1 3 / B B B`| 中按 | 水平邻居逻辑 |

 ## 边缘情况

 由于生成的线性系统没有有效的第一行分配，因此处理了不可解的两单元行。 消除阶段检测矛盾，而不是产生无效的按压模式。 

处理单行和单列网格是因为相同的递归仍然适用。 丢失的邻居在位运算中仅贡献零。 

转置避免了隐藏的性能问题。 具有尺寸的网格`1 x 100000`否则将创建一个具有 100000 个变量的线性系统。 转置后就变成了`100000 x 1`，且系统只有一个变量。
