---
title: "CF 102375H - ICPC"
description: "对于给定的最大单词长度 (N)，字典包含长度从 (1) 到 (N) 的每个小写英文字符串。 相同长度的单词按字典顺序出现，而所有较短的单词排在前面。"
date: "2026-08-15T18:03:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102375
codeforces_index: "H"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u0421\u0435\u0432\u0435\u0440\u043e-\u0417\u0430\u043f\u0430\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041c\u043e\u0441\u043a\u0432\u044b ICPC 2019"
rating: 0
weight: 102375
solve_time_s: 165
verified: false
draft: false
---

[CF 102375H - ICPC](https://codeforces.com/problemset/problem/102375/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 45s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 对于给定的最大单词长度 (N)，字典包含长度从 (1) 到 (N) 的每个小写英文字符串。 相同长度的单词按字典顺序出现，而所有较短的单词排在前面。 连接整个字典会产生一个巨大的字符串。 我们需要四字符子字符串出现的次数`icpc`在该串联中，模 (10^9+7)。 

困难在于（N）可以大到（10^9）。 字典已经包含 (26^N) 个长度为 (N) 的单词，因此即使表示最后一层也是不可能的。 原始问题有 2 秒限制和 512 MiB 内存限制，这排除了与生成的单词或字符数量成比例的任何内容。 该解决方案必须以对数方式依赖于 (N)，使用模幂而不是一一枚举长度。 

有两种事件需要计数。 一次出现可以完全在一个字典单词内，也可以跨越两个连续单词之间的边界。 忽略第二种是一个微妙的错误，因为连接消除了单词之间的边界。 

例如，对于 (N=3)，没有单个单词足够长来包含`icpc`，也没有边界可以创建它。 正确答案是`0`。 盲目应用包含 (26^{N-4}) 的公式而不处理 (N<4) 的解决方案可能会意外地解释负指数。 

对于 (N=4)，答案是`4`， 不是`1`。 这个词`icpc`它本身贡献了一个内部事件。 跨连续四字母单词之间的边界创建了三个额外的出现，即之后的边界`cpci`,`pcic`， 和`cicp`。 仅计算单个单词内出现次数的解决方案会忽略这三个单词。 

一个长度的最后一个单词和下一个长度的第一个单词之间的边界也很容易被误处理。 例如，之间的边界`zzz`和`aaaa`完全由`z`后面跟着的字符`a`字符，所以它无法创建`icpc`。 将每个字典边界视为等效会过多计算此类转换。 

## 方法

 蛮力方法很简单。 按字典顺序生成每个单词，将它们连接起来，然后扫描`icpc`。 这是正确的，因为最终字符串中每个可能出现的情况都会被检查一次。 然而，有

 [
 26+26^2+\c点+26^N
 ]

 字数，总字符数为

 [
 \sum_{L=1}^{N} L26^L=\Theta(N26^N)。 
]

 对于 (N=10^9)，甚至 (26^N) 也无法表示，因此在时间限制变得相关之前，暴力破解就已经失败了。 

有用的观察结果是该模式具有固定长度四。 对于长度为 (L) 的字，可以逐个位置地计算内部出现次数，而无需构造任何字。 每个固定位置需要四个指定的字母，留下 (L-3) 个空闲位置，因此在该长度的所有单词中出现 (26^{L-4}(L-3)) 次。 

唯一剩下的问题是串联边界。 跨越边界的四字符出现必须从左侧的单词中取 (1)、(2) 或 (3) 个字符。 因为图案是`icpc`，所需的左后缀和右前缀分别为

 [
 (i,\cpc),\qquad
 (ic,\pc),\qquad
 （icp，\c）。 
]

 对于相同长度的连续单词，通过在基数（26）中增加左侧单词来获得右侧单词。 每个必需的左后缀均以字母结尾，除了`z`，因此没有进位到达前缀。 对于(L\ge4)，三种边界类型中的每一种都固定四个字符位置并留下(L-4)个任意位置。 因此，每种类型出现 (26^{L-4}) 次，产生 (3\cdot26^{L-4}) 次交叉出现。 

过渡从`z...z`到`a...a`贡献为零，因为它的边界字符仅包含`z`和`a`。 对于（L < 4），三个边界模式不能一致地适合该长度的单词，因此不存在相同长度的交叉出现。 

组合固定 (L\ge4) 的内部和交叉出现次数给出

 [
 (L-3)26^{L-4}+3\cdot26^{L-4}
 =L26^{L-4}。 
]

 所以整个问题变成了评估

 [
 \sum_{L=4}^{N}L26^{L-4}
 ]

 模 (10^9+7)。 

这是一个加权的几何级数。 我们可以使用几何和和加权几何和的标准公式来评估它，只需要一次模幂。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(N26^N)) | (O(N26^N)) | 太慢了 |
 | 最佳 | (O(\log N)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 如果(N<4)，则返回`0`。 没有一个单词包含四个字符，并且不能形成短词边界`icpc`。 
2. 对于每个可能的单词长度 (L\ge4)，计算完全在单词内部出现的次数。 对于每个 (L-3) 个可能的起始位置，剩余字符有 (26^{L-4}) 个选择，给出 ((L-3)26^{L-4})。 
3. 计算跨越相同长度的连续字之间边界的出现次数。 分裂`icpc`在其第一个、第二个或第三个字符之后给出了三种可能的边界形状。 对于每个形状，四个字符位置是固定的，其他 (L-4) 个位置是任意的，因此每个形状贡献 (26^{L-4})。 因此，边界贡献为 (3\cdot26^{L-4})。 
4. 添加两个贡献。 总长度 (L) 为

 [
 (L-3+3)26^{L-4}=L26^{L-4}。 
]

 1.设(k=L-4)并设(t=N-3)。 那么(k)的范围是从(0)到(t-1)，答案就变成

 [
 \sum_{k=0}^{t-1}(k+4)26^k。 
]

 将其分成

 [
 \sum_{k=0}^{t-1}k26^k
 +
 4\sum_{k=0}^{t-1}26^k。 
]

 1.使用几何级数公式

 [
 \sum_{k=0}^{t-1}r^k=\frac{r^t-1}{r-1}
 ]

 与（r=26）。 

1.使用加权几何级数公式

 \frac{r-tr^t+(t-1)r^{t+1}}{(r-1)^2}。 
]

 所有除法均以模 (10^9+7) 执行。 由于 (r-1=25) 以素数模为模非零，因此存在其模逆。 

1. 使用二进制求幂计算 (26^t\bmod(10^9+7))。 这是唯一对数依赖于 (N) 的操作，因此完整的算法需要 (O(\log N)) 时间。 

### 为什么它有效

 对于每个长度 (L)，每次出现都唯一地属于一个单词内或恰好跨越连续单词之间的一个边界。 内部计数考虑每个可能的起始位置以及剩余字符的每个分配。 对于边界出现，分割点必须是三个内部切割之一`icpc`，并且词典后继结构在 (L\ge4) 时准确给出每次切割的 (26^{L-4}) 有效边界。 不同字长之间的转换没有任何贡献。 因此，每个长度的确切贡献是 (L26^{L-4})，最终的几何级数计算精确评估这些贡献的总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7
R = 26
INV25 = 280000002

def solve():
    n = int(input())

    if n < 4:
        print(0)
        return

    # We need:
    # sum_{k=0}^{t-1} (k + 4) * 26^k
    t = n - 3

    p = pow(R, t, MOD)

    # sum_{k=0}^{t-1} r^k
    geometric = (p - 1) % MOD
    geometric = geometric * INV25 % MOD

    # sum_{k=0}^{t-1} k * r^k
    weighted_num = (
        R
        - (t % MOD) * p
        + ((t - 1) % MOD) * p % MOD * R
    ) % MOD

    weighted = weighted_num * INV25 % MOD * INV25 % MOD

    answer = (weighted + 4 * geometric) % MOD
    print(answer)

if __name__ == "__main__":
    solve()
```早期返回处理整个 (N<4) 范围，避免负指数和无效的边界假设。 

变量`t = n - 3`是代入后的项数(k=L-4)。 对于（N=4），`t`是一，所以总和只包含项 (4\cdot26^0=4)，完全符合要求。 

价值`p`存储 (26^t) 对答案模进行取模。 Python 内置的`pow(base, exponent, modulus)`有效地执行模幂运算并且不会构造巨大的整数 (26^t)。 

(25) 的倒数为`280000002`，因为

 [
 25\cdot280000002\equiv1\pmod{10^9+7}。 
]

 加权级数分子减少模数`MOD`乘法之前。 Python 整数不会溢出，但减少中间值可以保持算术较小并使模块化结构更明确。 

这两个分量是分开计算的，因为原始被加数 (k+4) 自然地分为加权几何级数和普通几何级数的四个副本。 

## 工作示例

 对于(N=3)，算法立即停止。 

| (N)| (N<4) | 回答 |
 | ---| ---| ---|
 | 3 | 真实 | 0 |

 没有四字词，所以没有内生。 过渡从`zzz`到`aaaa`无法生产`icpc`，并且较短的边界不能包含四个必需的字符。 这证实了下限处理。 

对于（N=5），长度四和五有贡献。 

| (左)| 内部| 穿越| 总计 |
 | ---| ---| ---| ---|
 | 4 | (1\cdot26^0=1) | (3\cdot26^0=3) | 4 |
 | 5 | (2\cdot26^1=52) | (3\cdot26^1=78) | 130 | 130
 | | | | **134** |

 代入 (k=L-4) 后，我们有 (t=2)，所以

 # 4+5\cdot26

 1.

 ]

 跟踪证实了计数参数的两个部分。 长度四贡献 4 次出现，而长度五贡献 130 次，给出所需的样本输出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(\log N)) | 一次模幂计算 (26^{N-3}) |
 | 空间| (O(1)) | (O(1)) | 仅存储恒定数量的模整数 |

 最大可能的 (N) 是 (10^9)，因此迭代所有长度已经太慢了。 对于这样的指数，二进制求幂仅需要大约 30 个平方步骤，使得该解决方案非常适合规定的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 10**9 + 7
INV25 = 280000002

def solution():
    input = sys.stdin.readline
    n = int(input())

    if n < 4:
        print(0)
        return

    t = n - 3
    p = pow(26, t, MOD)

    geometric = (p - 1) % MOD
    geometric = geometric * INV25 % MOD

    weighted_num = (
        26
        - (t % MOD) * p
        + ((t - 1) % MOD) * p % MOD * 26
    ) % MOD

    weighted = weighted_num * INV25 % MOD * INV25 % MOD

    print((weighted + 4 * geometric) % MOD)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solution()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def brute(n: int) -> int:
    # Independent reference for small n.
    words = []

    for length in range(1, n + 1):
        total = 26 ** length
        for x in range(total):
            chars = []
            y = x
            for _ in range(length):
                chars.append(chr(ord('a') + y % 26))
                y //= 26
            words.append(''.join(reversed(chars)))

    s = ''.join(words)
    return sum(s[i:i + 4] == 'icpc' for i in range(len(s) - 3))

def fast_reference(n: int) -> int:
    if n < 4:
        return 0

    ans = 0
    power = 1

    for length in range(4, n + 1):
        ans = (ans + length * power) % MOD
        power = power * 26 % MOD

    return ans

# Provided samples
assert run("3\n") == "0", "sample 1"
assert run("5\n") == "134", "sample 2"

# Minimum size
assert run("1\n") == "0", "minimum N"

# Boundary where the first occurrences appear
assert run("4\n") == "4", "first non-zero case"

# Small case with an independent brute-force reference
assert run("6\n") == str(brute(6)), "small brute-force cross-check"

# Uniform boundary words such as zzz...z -> aaa...a must contribute nothing
assert run("3\n") == "0", "uniform word boundary"

# Maximum allowed N, checked against a direct O(N) modular reference.
# This reference is used only by the test harness, not by the submitted solution.
assert run("1000000000\n") == str(fast_reference(1000000000)), "maximum N"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3`|`0`| 模式无法容纳的最小范围 |
 |`4`|`4`| 第一个非零情况和所有三个边界分裂 |
 |`5`|`134`| 内部和交叉贡献 |
 |`6`|`4190`| 独立强力交叉检查 |
 |`1000000000`| 由模块化参考计算| 最大约束和对数幂|

 这`N=4`case 特别有用，因为仅计算单词内部出现次数的解决方案会返回`1`，而正确答案是`4`。 这`N=6`case 与实际生成的字典进行比较，因此它检查整个组合推导，而不仅仅是最终公式的另一个实现。 最大大小测试验证该实现不会意外地迭代 (N) 或构造任何字典单词。 

## 边缘情况

 对于 (N=3)，输入为```
3
```算法输入`n < 4`分支和返回`0`。 字典中没有一个单词有四个字符。 唯一看起来可疑的长度转换是`zzz`其次是`aaaa`，但该边界是由`z`和`a`，所以它不能包含`icpc`。 

对于 (N=4)，输入为```
4
```这里(t=1)，(26^t=26)，几何和为(1)。 加权几何和为 (0)，因为它的唯一项是 (0\cdot26^0)。 最终的表达式为(0+4\cdot1=4)。 这四次出现由单词中的一次内部出现组成`icpc`以及之后的三个交叉事件`cpci`,`pcic`， 和`cicp`。 

对于 (N=5)，两个相关长度贡献 (4) 和 (130)。 长度为四，总数为 (4)。 长度为 5 时，有 (2\cdot26=52) 个内部出现和 (3\cdot26=78) 个交叉出现。 它们的总和是 (134)，与样本匹配。 

对于最大输入```
1000000000
```该算法从不尝试构造单词或迭代 (10^9) 个可能的长度。 它设置 (t=999999997)，在 (O(\log N)) 乘法中使用模幂计算 (26^t)，并计算两个封闭式和。 指数很大，但其二进制表示只有大约 30 位，因此实际计算量保持恒定大小。 

字典进位边界由组合参数隐式处理。 对于三个有用的边界形状，左边的单词必须以`i`,`c`， 或者`p`，其中没有一个是`z`。 因此，到下一个词典单词的增量仅更改最后一个字符，而不能更改所需的前缀。 非凡的`z...z`到`a...a`边界被单独处理并且贡献为零。
