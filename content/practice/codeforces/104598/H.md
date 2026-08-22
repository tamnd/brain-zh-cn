---
title: "CF 104598H - 模型评估"
description: "该任务给出两个数字方形网格，大小均为 $N 乘 N$，表示两个图像的像素强度。 对于每个查询，我们在这些网格内给出一个矩形子区域，由两个对角指定。"
date: "2026-06-30T03:07:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104598
codeforces_index: "H"
codeforces_contest_name: "GPL 2023 Advanced"
rating: 0
weight: 104598
solve_time_s: 86
verified: true
draft: false
---

[CF 104598H - 模型评估](https://codeforces.com/problemset/problem/104598/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该任务给出了两个数字方格，两者的大小$N \times N$，表示两个图像的像素强度。 对于每个查询，我们在这些网格内给出一个矩形子区域，由两个对角指定。 对于该矩形，我们计算图像中值的总和$A$以及图像中值的总和$B$，然后输出这两个和之间的绝对差。 

每个查询都是独立的，因此我们被反复要求评估两个矩阵中的矩形和并比较它们。 

这些限制使得这个天真的想法变得不可行。 和$N \le 800$，网格最多有$6.4 \times 10^5$细胞，并且最多可以有$7 \times 10^4$查询。 如果每个查询通过扫描该区域中的所有单元格重新计算矩形总和，则最坏情况的矩形是整个网格，导致大约$800^2 \cdot 70000$的操作，远远超出了时间限制。 

常见的边缘情况涉及大矩形，其中$r_1 > r_2$或者$c_1 > c_2$。 问题陈述允许任何顺序的坐标，因此假设有序角的幼稚实现将默默地计算不正确的子区域，除非它首先标准化坐标。 

另一个陷阱是溢出。 每个单元最多可达$10^9$，所以一个完整的$800 \times 800$总和达到$6.4 \times 10^{14}$，它不适合 32 位整数，需要 64 位算术。 

## 方法

 强力解决方案通过迭代矩形内的每个单元格并对两个网格中的值求和来处理每个查询。 这是简单且正确的，但其每次查询的成本取决于矩形面积。 在最坏的情况下，每个查询都会触及$O(N^2)$细胞，导致$O(N^2 Q)$，对于大的来说太慢了$Q$。 

关键的观察是可以使用前缀和表预先计算矩形和。 我们不是为每个查询重新计算总和，而是将每个网格预处理为 2D 前缀总和数组，以便可以使用包含-排除在恒定时间内获得任何子矩形总和。 由于我们需要两个图像的总和，因此我们构建两个前缀总和数组，并通过减去它们并取绝对值来回答每个查询。 

这减少了每个查询的扫描次数$O(N^2)$细胞到$O(1)$，这将问题从不可行变为有效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(N^2 Q)$|$O(1)$| 太慢了|
 | 前缀和 |$O(N^2 + Q)$|$O(N^2)$| 已接受 |

 ## 算法演练

 我们为每个图像构建标准的 2D 前缀和。 

1. 读取两个网格$A$和$B$。 这些被视为索引从 1 到$N$。 这简化了前缀和中的边界处理。 
2. 构造前缀和$SA$和$SB$，其中每个条目存储来自的子矩阵的总和$(1,1)$到$(i,j)$。 每个值都是使用之前计算的前缀来计算的，确保每个单元格都被处理一次。 
3. 对于每个查询，标准化坐标，以便$r_1 \le r_2$和$c_1 \le c_2$。 当输入角点以相反顺序给出时，这可以避免错误的范围。 
4. 计算矩形的总和$A$使用包含-排除：$$SA(r_2,c_2) - SA(r_1-1,c_2) - SA(r_2,c_1-1) + SA(r_1-1,c_1-1)$$同样的计算也适用于$SB$。 
5. 输出两个结果的绝对差值。 

现在每个查询仅使用常数时间算术。 

### 为什么它有效

 2D 前缀和对累积区域和进行编码，以便任何矩形都可以分解为四个前缀区域。 包含-排除仅取消重叠区域一次。 由于每个单元格仅对前缀项的一种组合做出贡献，因此计算值与真实的矩形和相匹配。 两个独立正确的矩形和之间的减法保留了最终绝对差的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_prefix(grid, n):
    ps = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        row_sum = 0
        for j in range(1, n + 1):
            row_sum += grid[i-1][j-1]
            ps[i][j] = ps[i-1][j] + row_sum
    return ps

def rect_sum(ps, r1, c1, r2, c2):
    return (
        ps[r2][c2]
        - ps[r1-1][c2]
        - ps[r2][c1-1]
        + ps[r1-1][c1-1]
    )

def solve():
    n, q = map(int, input().split())

    A = [list(map(int, input().split())) for _ in range(n)]
    B = [list(map(int, input().split())) for _ in range(n)]

    psa = build_prefix(A, n)
    psb = build_prefix(B, n)

    out = []
    for _ in range(q):
        r1, c1, r2, c2 = map(int, input().split())
        if r1 > r2:
            r1, r2 = r2, r1
        if c1 > c2:
            c1, c2 = c2, c1

        sa = rect_sum(psa, r1, c1, r2, c2)
        sb = rect_sum(psb, r1, c1, r2, c2)
        out.append(str(abs(sa - sb)))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```读取输入后，两个矩阵都会显式存储，以便索引与前缀结构匹配。 前缀数组是 1 索引的，以避免在查询内重复边界检查。 

矩形和函数应用标准包含-排除恒等式。 查询坐标的标准化步骤至关重要，因为输入不能保证角点的顺序。 

## 工作示例

 考虑第一个样本。 

我们为两个矩阵构建前缀和，然后处理查询$(1,1,1,3)$。 标准化后它保持不变。 矩形总和是在常数时间内根据前缀数组计算出来的，生成 11$A$和 9 为$B$，所以输出为 2。 

对于第二个查询$(3,3,1,2)$，标准化产生$(1,2,3,3)$。 前缀和给出的两个矩阵的总和相等，因此差值为 0。 

这些示例确认有序和反向坐标输入均已正确处理，并且前缀和返回一致的矩形聚合。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(N^2 + Q)$| 前缀构造加上恒定时间查询 |
 | 空间|$O(N^2)$| 两个前缀表的存储|

 该界限允许高达 800×800 的预处理，这完全在限制范围内。 多达 70000 个查询中的每一个都会在恒定时间内得到答复，确保解决方案能够轻松满足时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, q = map(int, input().split())
    A = [list(map(int, input().split())) for _ in range(n)]
    B = [list(map(int, input().split())) for _ in range(n)]

    def build(ps):
        n = len(ps)
        for i in range(n):
            for j in range(n):
                ps[i][j] += (ps[i-1][j] if i else 0) + (ps[i][j-1] if j else 0) - (ps[i-1][j-1] if i and j else 0)
        return ps

    psa = build(A)
    psb = build(B)

    def get(ps, r1, c1, r2, c2):
        res = ps[r2][c2]
        if r1: res -= ps[r1-1][c2]
        if c1: res -= ps[r2][c1-1]
        if r1 and c1: res += ps[r1-1][c1-1]
        return res

    out = []
    for _ in range(q):
        r1, c1, r2, c2 = map(int, input().split())
        r1, r2 = sorted([r1-1, r2-1])
        c1, c2 = sorted([c1-1, c2-1])
        out.append(str(abs(get(psa, r1, c1, r2, c2) - get(psb, r1, c1, r2, c2))))

    return "\n".join(out)

# provided sample
assert run("""3 2
3 1 7
2 5 2
5 8 4
5 2 2
1 3 7
4 9 4
1 1 1 3
3 3 1 2
""") == "2\n0"

# custom cases
assert run("""1 1
5
3
1 1 1 1
""") == "2", "single cell"

assert run("""2 1
1 2
3 4
4 3
2 1
1 1 2 2
""") == "0", "equal sums"

assert run("""2 1
1 1
1 1
2 2
2 2
1 1 2 2
""") == "0", "all equal"

assert run("""3 1
1 2 3
4 5 6
7 8 9
9 8 7
6 5 4
3 2 1
1 1 3 3
""") == "0", "full symmetry"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1x1 网格 | 2 | 单细胞减法正确性|
 | 2x2 交换值 | 0 | 全电网取消|
 | 相同矩阵| 0 | 基线正确性|
 | 反向结构化网格| 0 | 一致的矩形聚合|

 ## 边缘情况

 单单元格查询，例如$(i,j,i,j)$测试前缀减法是否正确退化。 在这种情况下，所有外部前缀项都会取消，仅保留单个单元格，因此两个总和都会减少到该条目，并且会正确计算差值。 

反向坐标查询，例如$(r_2,c_2,r_1,c_1)$测试是否应用归一化。 如果不进行排序，前缀减法将访问无效区域并产生不正确的结果，但在交换坐标后，矩形将变得有效，并且包含排除会干净地应用。 

全网格查询测试大前缀和是否超过 32 位界限。 使用 Python 整数可以避免溢出并保持正确性，即使总和达到$10^{14}$规模。
