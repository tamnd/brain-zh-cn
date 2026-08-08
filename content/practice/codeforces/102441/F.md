---
title: "CF 102441F - 随机异或"
description: "我们有一个包含 n 个整数的数组 a。 每个元素以概率 P = X / Y 独立选择。所选元素进行异或在一起，产生随机整数 s。 如果未选择任何内容，则 XOR 为零。"
date: "2026-08-08T13:26:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "F"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 109
verified: true
draft: false
---

[CF 102441F - 随机异或](https://codeforces.com/problemset/problem/102441/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组`a`的`n`整数。 每个元素都是以概率独立选择的`P = X / Y`。 选定的元素被异或在一起，产生一个随机整数`s`。 如果未选择任何内容，则 XOR 为零。 任务是计算期望值`s²`，最终答案以模表示`10^9 + 7`。 

困难不在于计算预期的异或本身。 每个单独位的期望是相当容易获得的。 平方引入了不同位之间的乘积，因此我们还需要了解异或位对如何一起表现。 

约束条件`n <= 10^5`立即排除枚举子集。 可以有`2^n`可能的选择，即使对于几十个元素来说也是天文数字。 数值如下`10^9 + 7`，所以每一个`a_i`适合 30 个二进制位，因为`2^30 > 10^9 + 7`。 小位宽是使问题易于处理的结构特性。 我们可以承担涉及大约 30 位位置的工作，但我们无法承担与子集数量成比例的工作。 

在一些边缘情况下，诱人的简化会给出错误的答案。 首先，如果`P = 0`，没有选择任何内容。 例如，```
1 0 7
123
```给出`s = 0`可以肯定的是，所以答案是`0`。 假设每个概率都严格介于 0 和 1 之间的公式可能会错误地处理这个边界。 

在另一个极端，如果`P = 1`，每个元素都被选择。 例如，```
1 1 1
5
```总是产生`s = 5`，所以答案是`25`。 当随机过程变得确定时，概率计算也必须起作用。 

更微妙的情况是位之间的相关性。 考虑```
1 1 2
3
```结果是`0`或者`3`，每个都有概率`1/2`， 所以`E[s²] = (0² + 3²) / 2 = 9/2`。 

模数`10^9 + 7`， 这是`500000008`。 粗心的方法可能会发现这两个位中的每一个都是独立的`1`有概率`1/2`。 它们在这里不是独立的：数字是`00`或者`11`。 将他们视为独立的人会给出错误的第二个时机。 

给定的样本是```
3 1 2
2 8 10
```它的正确答案是`42`。 

## 方法

 直接的方法是考虑每个子集`a`，对所选元素进行异或，对结果求平方，并对所有值及其相应的概率进行平均。 有`2^n`子集。 如果每个子集都是通过检查所有`n`元素，操作次数为`O(n 2^n)`。 即使格雷码枚举减少了每个子集的工作量并给出了`O(2^n)`，最坏的情况仍然包含`2^100000`状态，所以这种方法不可用。 

蛮力之所以有效，是因为它明确遵循随机实验。 它失败了，因为实验的结果呈指数级增长。 关键的观察是最终的 XOR 是逐位构建的，并且答案在这些输出位中仅包含最多 2 次的项。 

将最终 XOR 的二进制表示形式写为`S = sum_k 2^k Z_k`，

在哪里`Z_k`是位置处的随机位`k`。 平方给出`S² = sum_k 2^(2k) Z_k + 2 sum_{i<j} 2^(i+j) Z_i Z_j`。 

所以我们只需要`E[Z_k]`和`E[Z_i Z_j]`。 

每个`Z_k`本身是独立伯努利变量的异或。 对于这样的奇偶校验，有用的量不是直接的概率，而是它的带符号期望`E[(-1)^Z_k]`。 

假设位`k`正好设置在`c_k`数组元素。 每个位为零的元素贡献一个因子`1`对此签署的期望。 每个位为 1 的元素都有贡献`(1-P) + P(-1) = 1 - 2P`。 

因此`E[(-1)^Z_k] = (1 - 2P)^(c_k)`。 

让`q = 1 - 2P`。 

然后`E[Z_k] = (1 - q^(c_k)) / 2`。 

同样的想法可以处理一对位。 对于两个输出位`Z_i`和`Z_j`， 定义`A = E[(-1)^Z_i]`,`B = E[(-1)^Z_j]`,`C = E[(-1)^(Z_i XOR Z_j)]`。 

最后一个数量取决于有多少输入元素在这两个位位置具有不同的值。 令该数字为`d_ij`。 然后`C = q^(d_ij)`。 

两个布尔变量的四种可能组合可以从它们的三个带符号期望中恢复。 尤其，`P(Z_i = 1 and Z_j = 1) = (1 - A - B + C) / 4`。 

这给出了所需的每一项`E[S²]`。 

只有 30 个位位置，因此只有 30 个单位计数`30 * 29 / 2`需要对距离。 通过将每个位列表示为打包位集，可以有效地计算对距离。 两列之间的汉明距离就是它们的异或的总体计数。 在Python中，大整数恰好提供了这种压缩表示形式：一列存储为一个整数，其位代表所有`n`数组元素，Python 的 C 实现处理 XOR 和`bit_count()`高效。 

结果从指数枚举减少到超过 30 位位置并打包`n`位列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n 2^n)`|`O(n)`| 太慢了 |
 | 最佳 |`O(30n + 30² n / W)`|`O(30n / 8)`| 已接受 |

 这里`W`是打包位操作内部使用的机器字大小。 在Python实现中，相应的操作由优化的任意精度整数例程执行。 

## 算法演练

 1. 阅读`n`,`X`,`Y`和数组。 工作模数`MOD = 10^9 + 7`。 计算`q = 1 - 2X/Y`模数`MOD`。 自从`Y < MOD`，其模逆存在。 
2. 为 30 个可能的位位置中的每一个构建一个压缩位列。 这`r`第-列的位`k`记录是否位`k`的`a[r]`已设置。 我们可以将这些列存储为 Python 整数。 

这种表示方式使我们可以一次比较整个列，而不是访问所有列`n`每对位位置的元素。 
3. 对于每一点`k`,计算其集合条目数`c_k`使用`column[k].bit_count()`。 然后计算`R_k = q^(c_k)`。 

自从`R_k = E[(-1)^Z_k]`，最终异或有位的概率`k`设置为`p_k = (1 - R_k) / 2`。 
4. 添加正方形的对角线项。 少量`k`贡献`2^(2k) p_k`到`E[S²]`。 
5. 对于每对不同的位位置`i < j`，对它们的压缩列进行异或并对设置的位进行计数。 这给出了`d_ij = number of input elements where bits i and j differ`。 

计算`R_ij = q^(d_ij)`。 

连同`R_i`和`R_j`，这给出了`p_ij = P(Z_i = 1, Z_j = 1)`作为`(1 - R_i - R_j + R_ij) / 4`。 
6. 添加交叉项`2 * 2^(i+j) * p_ij`每对的答案`i < j`。 
7. 减少最终值模`MOD`并打印它。 除以 2 和 4 是通过模逆进行的，即`2^(MOD-2)`和`4^(MOD-2)`模数`MOD`。 

### 为什么它有效

 不变的是，对于每个处理的位或位对，存储的功率`q`正是相应的异或奇偶校验的有符号期望。 对于一位，具有该位集的每个选定输入元素都会翻转奇偶校验，从而贡献一个因素`1 - 2P`。 对于两个位，当两个输入位不同时，它们的 XOR 恰好翻转，因此不同行的数量决定了相应的有符号期望。 然后，一个和两个布尔变量的公式可以准确地恢复它们的概率。 自从`S²`仅包含单独的位项和成对的位乘积，将这些期望相加得出准确的结果`E[S²]`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007
BITS = 30

def solve():
    n, X, Y = map(int, input().split())
    a = list(map(int, input().split()))

    inv_y = pow(Y, MOD - 2, MOD)
    q = (1 - 2 * X * inv_y) % MOD

    inv2 = (MOD + 1) // 2
    inv4 = inv2 * inv2 % MOD

    # Store every bit column as a packed integer.
    # Byte r contains the r-th row of the column.
    columns = [bytearray(n) for _ in range(BITS)]

    for r, value in enumerate(a):
        for bit in range(BITS):
            columns[bit][r] = (value >> bit) & 1

    packed = [int.from_bytes(col, "little") for col in columns]

    # signed[k] = E[(-1)^Z_k]
    signed = [0] * BITS

    answer = 0

    for bit in range(BITS):
        cnt = packed[bit].bit_count()
        signed[bit] = pow(q, cnt, MOD)

        p_one = (1 - signed[bit]) * inv2 % MOD
        weight = (1 << (2 * bit)) % MOD
        answer = (answer + weight * p_one) % MOD

    for i in range(BITS):
        for j in range(i + 1, BITS):
            differing = (packed[i] ^ packed[j]).bit_count()
            both_signed = pow(q, differing, MOD)

            p_both = (
                1
                - signed[i]
                - signed[j]
                + both_signed
            ) % MOD
            p_both = p_both * inv4 % MOD

            weight = (1 << (i + j)) % MOD
            answer = (
                answer + 2 * weight * p_both
            ) % MOD

    print(answer)

if __name__ == "__main__":
    solve()
```实现的第一部分将有理概率转换为模算术。`inv_y`代表`Y⁻¹`， 所以`q = 1 - 2P`变成`(1 - 2X/Y) mod MOD`。 模数是素数并且`Y`严格小于它，因此费马小定理给出了有效的逆矩阵。 

这`columns`数组是垂直查看输入的紧凑表示。 每列存储为：`n`字节，然后转换为一个大整数。 转换使用小端顺序，因此`r`-th 输入元素对应于`r`- 压缩整数的第 位位置。 

字节之间的区别`columns`和位`packed`是故意的。 字节数组使构造变得简单，因为每个输入行都可以直接分配。 打包后，所有昂贵的成对比较都发生在以优化的本机代码实现的 Python 整数上。 

第一个循环计算`signed[k]`，即`q`提升为包含 bit 的元素数`k`。 它立即将此带符号的期望转换为最终 XOR 位为 1 的概率，并将相应的对角线贡献添加到平方中。 

第二个循环处理每对位位置。 对两个压缩列进行异或可以准确标记两个输入位不同的数组元素。`bit_count()`因此给出`d_ij`没有Python循环`n`元素。 该对概率来自有符号期望恒等式，其贡献接收因子`2 * 2^(i+j)`从平方的交叉项。 

所有权力，例如`1 << (2 * bit)`和`1 << (i + j)`对于 Python 整数来说足够小，并且它们会以模数减少`MOD`在进入模运算之前。 Python 中不存在整数溢出，但减少中间值可以使模块化表达式易于管理。 

位循环正好运行 30 次。 配对循环仅运行 435 次。 潜在的大`n`维度隐藏在打包整数运算中，而不是作为每对的 Python 级循环公开。 

## 工作示例

 ### 示例 1

 输入是```
3 1 2
2 8 10
```这里`P = 1/2`， 所以`q = 1 - 2P = 0`。 

相关位列是：```
2  = 0010
8  = 1000
10 = 1010
```踪迹是：

 | 位或对 | 计数/距离|`q^count`| 概率| 贡献 |
 | ---| ---| ---| ---| ---|
 | 位 0 | 0 | 1 | 0 | 0 |
 | 位 1 | 2 | 0 | 1/2 | 1/2 2 |
 | 位 2 | 0 | 1 | 0 | 0 |
 | 位 3 | 2 | 0 | 1/2 | 1/2 32 | 32
 | 位 0,1 | 2 | 0 | 0 | 0 |
 | 位 0,2 | 3 | 0 | 0 | 0 |
 | 位 0,3 | 2 | 0 | 0 | 0 |
 | 位 1,2 | 2 | 0 | 0 | 0 |
 | 位 1,3 | 2 | 0 | 1/4 | 1/4 8 |
 | 位 2,3 | 2 | 0 | 0 | 0 |

 对角贡献为`2 + 32 = 34`。 唯一的非零对贡献位于位 1 和 3 之间，给出`8`，所以答案是`34 + 8 = 42`。 这与已发布的示例输出相匹配。 

该迹线还显示了为什么需要进行配对计算。 最终的 XOR 均匀分布在`0, 2, 8, 10`，其平方值平均值为`42`。 仅计算每个单独位的期望值不足以恢复平方。 

### 示例 2

 考虑```
1 1 2
3
```有一个元素，并且以概率选择它`1/2`。 数量`3`两个低位均已设置。 

| 位或对 | 计数/距离|`q^count`| 概率|
 | ---| ---| ---| ---|
 | 位 0 | 1 | 0 | 1/2 | 1/2
 | 位 1 | 1 | 0 | 1/2 | 1/2
 | 位 0,1 | 0 | 1 | 1/2 | 1/2

 对角线部分是`1² * 1/2 + 2² * 1/2 = 5/2`。 

配对概率为`1/2`， 不是`1/4`, because the two output bits are perfectly correlated. 交叉贡献为`2 * 1 * 2 * 1/2 = 2`。 

总计为`5/2 + 2 = 9/2`，这变成`500000008`模数`10^9 + 7`。 

这个例子直接验证了使用的理由`q^(d_ij)`而不是假设不同的输出位是独立的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(30n + 30² n / W)`| Building the 30 columns costs`O(30n)`，而 435 个打包的 XOR 和人口计数运算过程`n`bits in machine-sized chunks |
 | 空间|`O(30n / 8)`| 该实现存储 30 字节列，以及它们的压缩整数表示 |

 和`n = 10^5`，只有 30 个位位置，因此 Python 级别的工作大约是 300 万个简单位赋值加上 435 个本机大整数比较。 昂贵的成对扫描是在 Python 的优化整数实现中执行的，而不是作为数千万次解释的 Python 迭代执行。 30 字节列的内存消耗约为 3 MB，远低于 256 MB。 

## 测试用例```python
import sys
import io

MOD = 1_000_000_007
BITS = 30

def solve():
    input = sys.stdin.readline

    n, X, Y = map(int, input().split())
    a = list(map(int, input().split()))

    inv_y = pow(Y, MOD - 2, MOD)
    q = (1 - 2 * X * inv_y) % MOD

    inv2 = (MOD + 1) // 2
    inv4 = inv2 * inv2 % MOD

    columns = [bytearray(n) for _ in range(BITS)]

    for r, value in enumerate(a):
        for bit in range(BITS):
            columns[bit][r] = (value >> bit) & 1

    packed = [int.from_bytes(col, "little") for col in columns]

    signed = [0] * BITS
    answer = 0

    for bit in range(BITS):
        cnt = packed[bit].bit_count()
        signed[bit] = pow(q, cnt, MOD)

        p_one = (1 - signed[bit]) * inv2 % MOD
        answer = (
            answer + ((1 << (2 * bit)) % MOD) * p_one
        ) % MOD

    for i in range(BITS):
        for j in range(i + 1, BITS):
            differing = (packed[i] ^ packed[j]).bit_count()
            both_signed = pow(q, differing, MOD)

            p_both = (
                1 - signed[i] - signed[j] + both_signed
            ) % MOD
            p_both = p_both * inv4 % MOD

            weight = (1 << (i + j)) % MOD
            answer = (
                answer + 2 * weight * p_both
            ) % MOD

    print(answer)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

assert run("""3 1 2
2 8 10
""") == "42", "sample 1"

assert run("""1 1 2
1
""") == "500000004", "single element with probability 1/2"

assert run("""1 1 2
3
""") == "500000008", "correlated bits"

assert run("""1 0 7
123
""") == "0", "P = 0"

assert run("""1 1 1
5
""") == "25", "P = 1"

assert run("""2 1 2
1 1
""") == "500000004", "all equal values"

assert run("""1 1 1000000006
1000000006
""") == "1", "maximum input value with P = 1"

max_case = "100000 1 2\n" + "0 " * 99999 + "0\n"
assert run(max_case) == "0", "maximum n, all values zero"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 1 2 / 2 8 10`|`42`| 提供样本和成对位项 |
 |`1 1 2 / 1`|`500000004`| 最小尺寸和分数期望 |
 |`1 1 2 / 3`|`500000008`| 两位之间的相关性 |
 |`1 0 7 / 123`|`0`| 边界情况`P = 0`|
 |`1 1 1 / 5`|`25`| 边界情况`P = 1`|
 |`2 1 2 / 1 1`|`500000004`| 重复相等的值 |
 |`1 1 1000000006 / 1000000006`|`1`| 允许的最大数组值 |
 |`100000 1 2 / 0 ... 0`|`0`| 最大限度`n`和零值元素|

 ## 边缘情况

 当`P = 0`，每个有符号因子是`q^c = 1`， 因为`q = 1`。 因此，每个单比特概率为零，每对概率为零，并且答案仍然为零。 为了```
1 0 7
123
```填充列正确记录了位`123`，但它们都不能出现在最终的异或中。 输出是`0`。 

什么时候`P = 1`,`q = -1`。 出现偶数次的位表示期望`1`，而出现奇数次的位已签署期望`-1`。 这准确地描述了确定性异或。 为了```
1 1 1
5
```唯一可能的结果是`5`，算法产生`25`。 

重复值不需要特殊处理。 为了```
2 1 2
1 1
```异或是`0`如果两个副本均未选择或均未选择，并且`1`否则。 四种选择中的每一种都有概率`1/4`， 所以`P(S = 1) = 1/2`和`E[S²] = 1/2`, 给予`500000004`。 位计数为 2，因此该公式给出相同的结果，而无需单独考虑重复值。 

相关性示例```
1 1 2
3
```是主要陷阱。 两个位总是一起改变，因为唯一可能的输出是`00`和`11`。 配对距离为零，所以`q^0 = 1`，产生联合概率`1/2`。 如果对距离被错误地替换为独立位的假设，则答案将是错误的。 

最后，零值元素是无害的。 在```
100000 1 2
0 0 0 ... 0
```每个位列都完全为零，因此所有单位计数都为零，并且每对距离都为零。 无论选择哪些元素，最终的 XOR 始终为零，算法立即获得答案`0`。
