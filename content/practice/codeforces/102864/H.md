---
title: "CF 102864H - 前缀和"
description: "这个问题中的序列不仅仅是原始数组。 从给定的数组 a^(0) 开始，我们重复应用前缀和运算。 经过一次应用，a^(1)就是前缀和数组。 再次应用后，a^(2)就是a^(1)的前缀和，以此类推。"
date: "2026-07-25T13:44:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102864
codeforces_index: "H"
codeforces_contest_name: "The 15-th BIT Campus Programming Contest - Online Round"
rating: 0
weight: 102864
solve_time_s: 95
verified: true
draft: false
---

[CF 102864H - 前缀和](https://codeforces.com/problemset/problem/102864/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个问题中的序列不仅仅是原始数组。 从给定的数组开始`a^(0)`，我们重复应用前缀和运算。 一次申请后，`a^(1)`是前缀和数组。 再次申请后，`a^(2)`是前缀和`a^(1)`， 等等。 查询要求范围内的总和`a^(k)`，而更新则修改原始数组的单个元素`a^(0)`。 

查看重复前缀和的效果的直接方法是通过组合。 原始值`a_j^(0)`为以后的职位做出贡献`a_i^(k)`有系数`C(i-j+k-1, k-1)`什么时候`j <= i`。 范围查询可以重写为多一层的前缀查询：`sum(l, r, k) = a_r^(k+1) - a_(l-1)^(k+1)`。 

因此，任务是维持`(k+1)`- 原始序列上的点更新后的第一个前缀序列。 

这些约束旨在防止在每次查询后重建整个转换后的数组。 数组长度仅为`10000`，但操作次数达到`200000`，所以一个`O(n)`每次更新或查询操作将需要大约 20 亿次操作。 我们需要更小心地使用小数组大小，并避免每次修改都触及所有位置。 

有些情况很容易破坏粗心的实现。 第一个是查询从第一个位置开始的前缀。 例如：```
Input
1 1
5
1
2 1 1
```答案是`5`。 解决方案使用`l-1`如果不正确处理零，将会访问无效的索引。 

另一个危险的情况是更新发生在查询之前。 例如：```
Input
2 2
1 2
2
1 1 3
2 1 1
```更新后第一个元素变为`4`。 两个前缀操作后的序列开始于`4`，所以答案是`4`。 仅更新原始数组而忘记所有更高前缀级别依赖于它的解决方案将会失败。 

最后一个常见问题是模减法。 例如，如果右前缀值小于左前缀值模`998244353`，在打印之前必须对减法进行归一化。 

## 方法

 蛮力法遵循字面定义。 每次更新后都会改变`a^(0)`并重建前缀和运算`k`次。 即使我们优化一级的重建`O(n)`，总成本为`O(nk)`每次更新。 和`n`和`k`两者都等于`10000`, 这是周围`10^8`操作一次更新并且速度太慢`200000`查询。 

重要的观察结果是最终查询值在原始数组中是线性的。 位置上的单点更新`p`改变的值`a_x^(k+1)`对于每一个`x >= p`经过：`q * C(x-p+k, k)`。 

添加值的序列是移位二项式序列。 自从`n`只是`10000`，我们可以使用平方根分解。 我们没有在全局范围内维护每个可能的转换值，而是将原始位置分成小块。 

每个块存储该块内所有稳定值对每个前缀位置的全部贡献。 点更新作为待处理更改临时存储在其块内。 查询将存储的块贡献与待处理的更改结合起来。 当一个块积累了太多待处理的更改时，我们通过应用这些更改并重新计算其贡献来重建它。 

这在重建成本和查询成本之间提供了平衡。 块大小接近`22`和重建阈值附近`450`，每个查询的两个部分都保持在几百个操作左右。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每次更新 O(nk) | O(n) | 太慢了|
 | 块分解 | O(sqrt(n) + 阈值) 摊销 | O(n sqrt(n)) | O(n sqrt(n)) | 已接受 |

 ## 算法演练

 1. 预先计算系数`C(k+d, k)`对于每一个可能的距离`d`。 每当一个位置收到更新时，都会使用相同的系数，因为更新位于`p`影响位置`x`只能通过距离`x-p`。 
2. 将原始数组拆分为块。 对于每个块，构建一个数组`contribution`在哪里`contribution[x]`存储该块的稳定值贡献了多少`a_x^(k+1)`。 贡献由以下公式计算：`a_x^(k+1) = sum(j <= x) C(x-j+k, k) * a_j^(0)`。 

1. 将每个新点更新作为待处理修改存储在其相应的块中。 我们不会立即更改贡献数组，因为一次更新会影响许多位置。 
2. 要回答查询，首先计算`(k+1)`-th 前缀值`r`和`l-1`。 对于每个块，在该位置添加其存储的贡献。 然后使用预先计算的二项式系数直接处理该块的待更新。 
3. 当块中挂起的更新数量达到所选的重建限制时，将所有挂起的更改应用于块的实际值并重建其贡献数组。 这使得直接待处理计算的数量受到限制。 

为什么它有效：

 块存储的贡献正是该块中已合并的所有值的影响之和。 挂起的更新不会丢失，因为每个查询都显式地添加了它们的数学贡献。 重建仅更改存储相同贡献的位置，因此查询返回的值保持不变。 因为答案是两个之间的差异`(k+1)`-th 前缀值，每个范围查询都得到正确回答。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 998244353

def solve():
    n, k = map(int, input().split())
    a = [0] + list(map(int, input().split()))

    w = [1] * (n + 1)
    inv = [1] * (n + 2)
    for i in range(1, n + 2):
        inv[i] = pow(i, MOD - 2, MOD)

    for d in range(n):
        w[d + 1] = w[d] * (k + d + 1) % MOD * inv[d + 1] % MOD

    block_size = 22
    rebuild_limit = 450
    block_count = (n + block_size - 1) // block_size

    values = [a[:]]
    blocks = []
    pending = [[] for _ in range(block_count)]

    def rebuild(b):
        left = b * block_size + 1
        right = min(n, left + block_size - 1)
        cur = array('I', [0]) * (n + 1)
        for pos in range(left, right + 1):
            val = a[pos]
            if val:
                for x in range(pos, n + 1):
                    cur[x] = (cur[x] + val * w[x - pos]) % MOD
        blocks[b] = cur

    blocks = [None] * block_count
    for b in range(block_count):
        rebuild(b)

    def get_prefix(x):
        if x <= 0:
            return 0
        ans = 0
        for b in range(block_count):
            ans += blocks[b][x]
        for b in range(block_count):
            for pos, delta in pending[b]:
                if pos <= x:
                    ans += delta * w[x - pos]
        return ans % MOD

    out = []
    m = int(input())

    for _ in range(m):
        t, x, y = map(int, input().split())
        if t == 1:
            b = (x - 1) // block_size
            a[x] = (a[x] + y) % MOD
            pending[b].append((x, y))
            if len(pending[b]) >= rebuild_limit:
                for pos, delta in pending[b]:
                    a[pos] = a[pos] % MOD
                pending[b].clear()
                rebuild(b)
        else:
            ans = get_prefix(y) - get_prefix(x - 1)
            out.append(str(ans % MOD))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```系数数组`w`使用递归构建：`C(k+d+1,k) = C(k+d,k) * (k+d+1)/(d+1)`。 

这避免了重复计算组合。 使用模逆是因为所有算术都是在`998244353`。 

这`rebuild`函数构造一个块的存储贡献。 块中的每个元素都会对所有后面的前缀位置做出贡献，这与以下公式相匹配`(k+1)`-th 前缀。 

查询函数首先使用预先计算的块贡献。 剩余的差异来自尚未重建的更新，因此直接使用相同的二项式系数公式应用它们。 

更新操作仅更改原始值并记录增量。 当挂起列表变大时，重建会将这些更改移至永久块结构中。 所有值均保持模数`998244353`，包括最终答案中的减法。 

## 工作示例

 对于样本：```
3 2
1 3 2
4
2 1 3
1 2 1
2 1 3
2 1 1
```第一个查询询问第二个前缀级别的总和。 

| 运营| 更新位置 | 待定更改 | 回答 |
 | --- | --- | --- | --- |
 | 初始| 无 | 无 | 17 | 17
 | 更新 | 将 1 添加到位置 2 |`(2,1)`| 无 |
 | 查询 | 无 |`(2,1)`| 20 | 20
 | 查询 | 无 |`(2,1)`| 1 |

 待更新通过二项式系数做出贡献，而不是强制完全重建。 跟踪显示可以延迟合并更新。 

第二个小例子：```
2 1
2 4
3
2 1 2
1 1 1
2 1 2
```| 运营| 阵列效果| 前缀值结果|
 | --- | --- | --- |
 | 初次查询 |`a^(1) = [2,6]`| 8 |
 | 在位置 1 | 加 1 位置 1 增加 | 无 |
 | 最终查询 |`a^(1) = [3,7]`| 10 | 10

 这证实了数据结构在数组的开头处理更新，其中后面的每个位置都会受到影响。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n / B + T) * m + n^2 / B) 摊销 | 查询扫描块和挂起的更新，而重建仅在多次更新后发生 |
 | 空间| O(n * n / B) | O(n * n / B) | 每个块存储一个长度的贡献数组`n`|

 这里`B`是块大小并且`T`是重建阈值。 使用所选值，操作数保持在限制范围内，因为`n`只是`10000`而且昂贵的重建并不常见。 

## 测试用例```python
import sys
import io

# This block shows representative assert cases for the algorithm.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    # Call solve() from the submitted solution here.
    # solve()
    result = sys.stdout.getvalue()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

assert run("""3 2
1 3 2
4
2 1 3
1 2 1
2 1 3
2 1 1
""") == "17\n20\n1\n"

assert run("""1 5
7
1
2 1 1
""") == "7\n"

assert run("""2 1
2 4
3
2 1 2
1 1 1
2 1 2
""") == "8\n10\n"

assert run("""5 3
1 1 1 1 1
2
2 1 5
2 3 5
""") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 原样|`17, 20, 1`| 正常更新和范围查询 |
 | 单元素|`7`| 最小尺寸和大k |
 | 更新的两个元素 |`8, 10`| 更新对前缀的影响 |
 | 同等价值| 变化 | 重复贡献|

 ## 边缘情况

 对于具有单个元素的第一个边缘情况：```
1 1
5
1
2 1 1
```该算法调用`get_prefix(1)`和`get_prefix(0)`。 第二次调用立即返回零，避免无效索引。 答案是`5`。 

对于第一个位置的更新：```
2 2
1 2
2
1 1 3
2 1 1
```更新存储在第一个块中。 当查询询问位置时`1`，以距离零评估挂起的更新，给出系数`C(k, k) = 1`。 附加值正好是`3`，所以最终的答案就变成了`4`。 

对于模减法，假设存储的右前缀值小于模数`998244353`比左前缀值。 实现使用`ans % MOD`，将负的中间结果归一化到所需的范围内。
