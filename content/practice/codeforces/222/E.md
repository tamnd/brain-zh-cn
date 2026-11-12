---
title: "CF 222E - 解码基因组"
description: "我们有一个大小为 m 的字母表，由序列 a..zA..Z 中的前 m 个符号组成。 一些有序的符号对是被禁止的。 如果 (x, y) 对被禁止，则 DNA 字符串中符号 y 不能紧跟在符号 x 之后出现。"
date: "2026-06-04T02:06:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "matrices"]
categories: ["algorithms"]
codeforces_contest: 222
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 137 (Div. 2)"
rating: 1900
weight: 222
solve_time_s: 115
verified: true
draft: false
---

[CF 222E - 解码基因组](https://codeforces.com/problemset/problem/222/E)

 **评级：** 1900
 **标签：** dp、矩阵
 **求解时间：** 1m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个大小的字母表`m`，由第一个组成`m`序列中的符号`a..zA..Z`。 一些有序的符号对是被禁止的。 如果对`(x, y)`被禁止，则符号`y`不能立即出现在符号之后`x`在DNA字符串中。 

任务是计算有多少条DNA串的长度`n`满足所有邻接限制。 答案必须以模数形式报告`10^9 + 7`。 

查看问题的一种有用方法是使用有向图。 每个核苷酸都是一个顶点。 从顶点有一条有向边`u`到顶点`v`如果一对`(u, v)`是允许的。 有效的 DNA 序列对应于该图中的步行。 序列中每对相邻的字符都必须遵循允许的边缘。 

约束完全决定了预期的解决方案。 字母大小最多为`52`，很小。 另一方面，`n`可以大到`10^15`，这排除了任何逐一迭代位置的动态规划。 甚至一个`O(n)`算法是不可能的。 每当一个问题将非常小的状态空间与巨大的长度结合在一起时，矩阵求幂通常是正确的方向。 

有几种边缘情况很容易被错误处理。 

考虑长度为一的 DNA：```
1 3 2
ab
ba
```答案是`3`，不受任何禁止对的影响。 长度为 1 的字符串根本不包含相邻的对。 

另一个重要的情况是禁止每次转换：```
2 1 1
aa
```答案是`0`。 有一个符号，但它不能跟随自身，因此不存在长度为 2 的序列。 

第三种情况是当`n`非常大但是`m = 1`:```
1000000000000000 1 0
```恰好有一个有效序列，即`"aaaa..."`。 任何迭代位置的解决方案都永远不会完成。 

## 方法

 最直接的方法是对仓位进行动态规划。 

让`dp[i][j]`是长度有效的字符串的数量`i`以符号结尾`j`。 为了计算下一层，我们尝试每个允许的转换：$$dp[i+1][v] += dp[i][u]$$这是正确的，因为每个有效字符串都以`u`可以扩展到`v`每当`(u,v)`是允许的。 

问题是值`n`。 即使我们使用较小的字母大小来优化转换，运行时间仍然与 DNA 的长度成正比。 和`n`最多`10^{15}`，这是没有希望的。 

关键的观察结果是 DP 转换是线性的。 如果我们将所有结束符号的计数存储在一个向量中，则一个 DP 步骤只是一个矩阵乘法。 

让`A`成为`m × m`转移矩阵：$$A[u][v] = \begin{cases} 1 & \text{if transition } u \to v \text{ is allowed}\\ 0 & \text{otherwise} \end{cases}$$如果`f_i`是长度计数的行向量`i`， 然后$$f_{i+1} = f_i A$$重复应用转换给出$$f_n = f_1 A^{n-1}$$现在价值巨大`n`变得易于管理。 自从`m ≤ 52`，我们可以使用二进制求幂对矩阵求幂`O(m^3 log n)`时间。 

长度为 1 的初始向量包含所有 1，因为可以选择任何符号作为第一个字符。 

计算后`A^(n-1)`，我们将其乘以初始向量并对所有最终计数求和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力 DP 超过位置 | O(nm²) | O(米) | 太慢了 |
 | 矩阵求幂| O(m³ log n) | O(平方米) | 已接受 |

 ## 算法演练

 1. 创建字符索引映射。 符号`'a'..'z'`映射到`0..25`， 和`'A'..'Z'`映射到`26..51`。 
2. 建立一个`m × m`转移矩阵`A`。 

最初每个条目都是`1`，意味着每次转换都是允许的。 
3. 读取每个禁止对`(x, y)`并将相应的矩阵项设置为`0`。 

该矩阵现在准确地表示了允许的转换图。 
4、特殊情况处理`n = 1`。 

每个符号单独形成一个有效的 DNA 字符串，所以答案很简单`m`。 
5. 计算`A^(n-1)`使用二进制求幂。 

每个矩阵乘法均以模进行`10^9 + 7`。 
6. 创建初始行向量$$f_1 = [1,1,\ldots,1]$$因为可以选择任何符号作为第一个字符。 
7. 乘法`f_1`经过`A^(n-1)`。 

结果向量包含有效长度的数量`n`以每个符号结尾的字符串。 
8. 对所得向量的所有条目求和`10^9 + 7`。 

这给出了有效 DNA 字符串的总数。 

### 为什么它有效

 转换矩阵编码与普通动态程序完全相同的递归。 入口`(u,v)`当字符串结尾为 时，正好等于 1`u`可以通过符号扩展`v`。 

将计数向量乘以`A`执行一次 DP 转换。 乘以`A²`执行两次转换。 通过归纳法，乘以`A^k`执行`k`连续的 DP 转换。 由于长度-`n`字符串由一个初始符号组成，后跟`n-1`转换，长度的计数向量`n`正是$$f_1 A^{n-1}.$$对最终向量求和会计算所有有效字符串，无论其结束符号如何。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def char_id(c):
    if 'a' <= c <= 'z':
        return ord(c) - ord('a')
    return ord(c) - ord('A') + 26

def mat_mul(a, b):
    n = len(a)
    res = [[0] * n for _ in range(n)]

    for i in range(n):
        ai = a[i]
        ri = res[i]

        for k in range(n):
            if ai[k] == 0:
                continue

            val = ai[k]
            bk = b[k]

            for j in range(n):
                ri[j] = (ri[j] + val * bk[j]) % MOD

    return res

def mat_pow(mat, exp):
    n = len(mat)

    res = [[0] * n for _ in range(n)]
    for i in range(n):
        res[i][i] = 1

    while exp:
        if exp & 1:
            res = mat_mul(res, mat)

        mat = mat_mul(mat, mat)
        exp >>= 1

    return res

def solve():
    n, m, k = map(int, input().split())

    trans = [[1] * m for _ in range(m)]

    for _ in range(k):
        s = input().strip()
        u = char_id(s[0])
        v = char_id(s[1])
        trans[u][v] = 0

    if n == 1:
        print(m)
        return

    power = mat_pow(trans, n - 1)

    ans = 0

    for col in range(m):
        total = 0
        for row in range(m):
            total += power[row][col]
        ans = (ans + total) % MOD

    print(ans)

solve()
```转移矩阵直接根据禁止对信息构建。 每个允许的邻接都会贡献一个`1`，每个禁止邻接都会贡献一个`0`。 

求幂例程使用标准二进制求幂模式。 自从`n`可以大到`10^15`，只需要大约五十次矩阵平方。 

最终的计算值得关注。 初始向量完全由 1 组成。 将全 1 的行向量乘以幂矩阵相当于将该矩阵的每一列相加。 该实现利用了这一事实并避免了额外的向量矩阵乘法。 

所有算术均以模进行`10^9 + 7`。 Python 整数不会溢出，但每次累加时减少模数可以保持计算效率。 

## 工作示例

 ### 示例 1

 输入：```
3 3 2
ab
ba
```允许的转移矩阵：

 | 从 \ 到 | 一个 | 乙| c |
 | --- | --- | --- | --- |
 | 一个 | 1 | 0 | 1 |
 | 乙| 0 | 1 | 1 |
 | c | 1 | 1 | 1 |

 求幂后我们需要`A²`。 

| 步骤| 矩阵|
 | --- | --- |
 | 一个 | 上面的过渡|
 | A²| 长度 2 次行走的计数 |

 计算列总和`A²`给出：

 | 专栏 | 总和 |
 | --- | --- |
 | 一个 | 5 |
 | 乙| 5 |
 | c | 7 |

 总计：

 | 价值|
 | --- |
 | 5 + 5 + 7 = 17 | 5 + 5 + 7 = 17 |

 输出：```
17
```该迹线显示矩阵幂对多个步骤的行走进行计数。 最终的答案是长度为三的字符串的总数。 

### 示例 2

 输入：```
2 3 0
```每一次转换都是允许的。 

转移矩阵：

 | 从 \ 到 | 一个 | 乙| c |
 | --- | --- | --- | --- |
 | 一个 | 1 | 1 | 1 |
 | 乙| 1 | 1 | 1 |
 | c | 1 | 1 | 1 |

 自从`n = 2`，我们需要`A¹`。 

| 专栏 | 总和 |
 | --- | --- |
 | 一个 | 3 |
 | 乙| 3 |
 | c | 3 |

 总计：

 | 价值|
 | --- |
 | 9 |

 输出：```
9
```这与明显的计数相符`3²`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m³ log n) | 三次矩阵乘法的矩阵求幂 |
 | 空间| O(平方米) | 存储多个`m × m`矩阵|

 自从`m ≤ 52`，矩阵乘法的成本大致为`52³ ≈ 140,000`算术运算。 二进制求幂的性能约为`log₂(10¹⁵) ≈ 50`迭代。 这完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 1000000007

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def char_id(c):
        if 'a' <= c <= 'z':
            return ord(c) - ord('a')
        return ord(c) - ord('A') + 26

    def mat_mul(a, b):
        n = len(a)
        res = [[0] * n for _ in range(n)]

        for i in range(n):
            for k in range(n):
                if a[i][k] == 0:
                    continue
                for j in range(n):
                    res[i][j] = (res[i][j] + a[i][k] * b[k][j]) % MOD

        return res

    def mat_pow(mat, exp):
        n = len(mat)
        res = [[0] * n for _ in range(n)]

        for i in range(n):
            res[i][i] = 1

        while exp:
            if exp & 1:
                res = mat_mul(res, mat)
            mat = mat_mul(mat, mat)
            exp >>= 1

        return res

    n, m, k = map(int, input().split())

    trans = [[1] * m for _ in range(m)]

    for _ in range(k):
        s = input().strip()
        trans[char_id(s[0])][char_id(s[1])] = 0

    if n == 1:
        return str(m)

    power = mat_pow(trans, n - 1)

    ans = 0
    for col in range(m):
        for row in range(m):
            ans = (ans + power[row][col]) % MOD

    return str(ans)

# sample
assert run("3 3 2\nab\nba\n") == "17"

# minimum size
assert run("1 1 0\n") == "1"

# single symbol, self-transition forbidden
assert run("2 1 1\naa\n") == "0"

# all transitions allowed
assert run("2 3 0\n") == "9"

# n=1 ignores restrictions
assert run("1 2 4\naa\nab\nba\nbb\n") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 0`|`1`| 尽可能小的实例 |
 |`2 1 1 / aa`|`0`| 禁止自环|
 |`2 3 0`|`9`| 全连接图 |
 |`1 2 4 ...`|`2`| 长度一忽略邻接限制 |

 ## 边缘情况

 考虑：```
1 2 4
aa
ab
ba
bb
```任何转变都是被禁止的，但答案是`2`。 该算法立即返回`n = 1`，因为单字符字符串中不存在邻接关系。 盲目求幂或应用转换的解决方案可能会错误地产生零。 

考虑：```
2 1 1
aa
```转移矩阵为：$$[0]$$自从`n-1 = 1`，动力矩阵仍为`[0]`。 列总和为零，因此答案为零。 这正确地捕捉到了唯一可能的相邻对被禁止的事实。 

考虑：```
1000000000000000 1 0
```矩阵是：$$[1]$$该矩阵的任何幂仍然存在`[1]`。 二进制求幂处理对数时间内的大指数，产生答案`1`。 这正是消除任何逐位置动态规划方法的场景。
