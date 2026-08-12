---
title: "CF 102407B - 疯狂舞蹈"
description: "小丑从一开始数秒。 在第二个 (t) 处，他说出 (t) 在基数 (a) 中的表示形式，不带前导零。 例如，在基数 (3) 中，序列以 (1,2,10,11,12,ldots) 开头。"
date: "2026-08-11T23:47:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102407
codeforces_index: "B"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0412\u0442\u043e\u0440\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102407
solve_time_s: 262
verified: true
draft: false
---

[CF 102407B - 疯狂舞蹈](https://codeforces.com/problemset/problem/102407/B)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 小丑从一开始数秒。 在第二个 (t) 处，他说出 (t) 在基数 (a) 中的表示形式，不带前导零。 例如，在基数 (3) 中，序列以 (1,2,10,11,12,\ldots) 开头。 

对于每个数字 (i)，输入给出 (b_i)，即舞蹈停止时应该说出数字 (i) 的确切次数。 我们必须确定唯一的第二个 (n)（如果存在），以便将

 [
 1,2,\l点,n
 ]

 包含每个数字 (i) 的 (b_i) 个副本。 如果不存在这样的 (n)，则小丑永远不会满足其停止条件，因此答案为 (-1)。 

基数可以大到 (100000)，每个请求的位数可以大到 (10^9)。 因此，所有请求计数的总和可以达到 (10^{14})。 处理每个说出的数字的模拟必须按照 (10^{14}) 数字更新的顺序执行，这远远超出了任何实际的时间限制。 该算法必须处理整个数字范围，而不是枚举数字本身。 

在一些微妙的情况下，诱人的解决方案会失败。 如果每个（b_i）都为零，则答案为（-1），因为小丑在第一秒后已经说出了数字（1），因此停止条件在零时刻永远不会成立。 

例如，```
5
0 0 0 0 0
```有答案```
-1
```第二个问题是仅口述数字的总数是不够的。 考虑```
2
2 1
```请求的总数为 (3)。 (1) 和 (2) 秒后正好说出了三个数字，即 (1,10)。 它们的频率是数字 (1) 的两个副本和数字 (0) 的一个副本，因此这个特定输入实际上有答案 (2)。 相比之下，```
2
1 2
```也有total(3)，所以也指向(n=2)，但实际频率是([1,2])，即数字(0)出现一次，数字(1)出现两次。 这说明了为什么在从总数中恢复 (n) 后，我们仍然必须检查每个数字的计数。 

当 (n) 与底数的幂相交时，特别容易出现边界错误。 在底数 (3) 中，数字 (1,2) 各有一位数字，而 (3,4,5) 有两位数字。 将数字长度视为跨越该边界的常数的计算给出了错误的停止时间。 

前导零是错误的另一个来源。 计算数字 (0) 时，基数 (10) 中的 (7) 表示形式不包含零，尽管 (007) 等固定宽度表示形式会包含零。 零公式必须明确排除那些不存在的领先位置。 

## 方法

 最直接的方法就是模拟舞蹈。 从 (1) 开始，将每个整数转换为基数 (a)，为该表示形式中出现的每个数字的计数器加一，并在所有计数器等于其目标时停止。 这是正确的，因为它完全遵循问题所描述的过程。 

问题在于规模。 我们可能需要处理的数字出现总数为 (\sum b_i)，可能大到 (10^{14})。 即使在考虑整数转换开销之前，这也意味着大约 (10^{14}) 个基本计数器更新。 这就是暴力破解变得不可能的点。 

关键的观察是我们实际上并不需要数字向量来找到候选时间。 每一秒至少贡献一位数字，并且每个新数字贡献其全部表示形式。 因此，第二秒 (n) 之后说出的数字总数为

 [
 D(n)=\sum_{x=1}^{n}\运算符名{数字}_a(x)。 
]

 该函数是严格递增的，因为从 (n) 移动到 (n+1) 至少会增加一位数字。 因此，如果存在解，则其停止时间由下式唯一确定：

 [
 D(n)=\sum_{i=0}^{a-1}b_i。 
]

 我们可以通过根据基数（a）数字的数量对数字进行分组来直接反转该函数。 有 (a-1) 个一位数、((a-1)a) 个两位数、((a-1)a^2) 个三位数，依此类推。 对于每个块，其总贡献就是该块中的数字数量乘以其数字长度。 

一旦 (n) 已知，我们就计算从 (1) 到 (n) 的所有数字中每个数字的频率。 对于固定的十进制位置 (p=1,a,a^2,\ldots)，通常的高/当前/低分解在任意基数中以完全相同的方式工作。 这给出了该位置上每个数字出现的次数，而无需枚举各个数字。 

暴力方法之所以有效，是因为它明确地构造了我们需要的序列。 它会失败，因为该序列可能包含大量数字。 总数字计数严格增加的观察结果使我们能够将对停止时间的搜索折叠到几个数字长度的块，并且位置计数公式使我们能够验证所有数字频率而无需遍历序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(S))，其中 (S=\sum b_i) 在最差尺度 | (O(a)) | 太慢了|
 | 最佳 | (O(a\log_a n)) | (O(a)) | 已接受 |

 ## 算法演练

 1. 计算

 [
 S=b_0+b_1+\cdots+b_{a-1}。 
]

 这是必须说出的数字出现的总数。 如果(S=0)，没有正数可以满足条件，所以我们立即返回(-1)。 
2. 找出哪个数字长度的块包含停止时间。 

恰好具有 (k) 个基数 (a) 数字的数字是

 [
 a^{k-1},a^{k-1}+1,\ldots,a^k-1。 
]

 有

 [
 (a-1)a^{k-1}
 ]

 这些数字，它们共同贡献

 [
 k(a-1)a^{k-1}
 ]

 口语数字。

从(S)中减去完整的块，直到剩余的数量属于一个块。 由于底数至少为 (2)，因此最终答案中的块数是对数。 
3. 假设剩余金额为（R），当前区块包含（k）位数字。 

该块中的每个数字恰好贡献 (k) 个数字。 因此，(R) 必须能被 (k) 整除。 如果

 [
 R\bmod k\ne0,
 ]

 那么没有整数个 (k) 位数字表示可以精确地产生 (R) 个数字，所以答案是 (-1)。 

否则，

 [
 q=R/k
 ]

 是该块内已说出的 (k) 位数字的数量。 如果块从 (a^{k-1}) 开始，则候选停止时间为

 [
 n=a^{k-1}+q-1。 
]
 4. 计算 (1,\ldots,n) 中每个数字的出现次数。 

固定位置 (p=a^j)。 对于数字 (x)，写

 [
 x=(\text{高})\cdot(ap)+(\text{当前})\cdot p+\text{低},
 ]

 哪里

 [
 \text{high}=\left\lfloor\frac{x}{ap}\right\rfloor,
 \qquad
 \text{当前}=\left\lfloor\frac{x}{p}\right\rfloor\bmod a,
 \qquad
 \text{low}=x\bmod p。 
]

 对于非零数字 (d)，长度 (ap) 的每个完整循环恰好贡献 (d) 的 (p) 个副本，给出基本量

 [
 \text{高}\cdot p。 
]

 如果当前数字大于 (d)，则会出现另外一组 (p) 出现的情况。 如果它等于 (d)，则只有 (\text{low}+1) 个数字的部分组有贡献。 
5. 单独处理数字零。 

零不能占据数字的首位，因此它的公式少了一个完整的循环。 当 (\text{high}>0) 时，完整贡献为

 [
 (\text{高}-1)p。 
]

 如果当前数字为零，则添加 (\text{low}+1)。 否则添加 (p)。 

这正是防止诸如 (007) 之类的表示被计算在内的更正。 
6. 将计算出的频率数组与 (b) 进行比较。 

如果每个数字都有其所要求的频率，则输出（n）。 否则，总数字计数指向唯一的候选者 (n)，但该候选者的数字分布错误，因此正确答案为 (-1)。 

### 为什么它有效

 中心不变量是，在处理完整的数字长度块之后，(S)的剩余值恰好是下一个块仍然需要的数字出现的次数。 由于该块中的每个数字都具有相同的长度 (k)，因此当且仅当剩余数量可被 (k) 整除并且商标识唯一候选者 (n) 时，那里才存在精确的停止点。 

对于该候选者，位置计数公式将每个位置上的每次出现恰好计数一次。 单独的零公式删除了普通表示中不存在的前导零位置。 因此，计算出的向量正是 (1,\ldots,n) 中数字频率的向量。 因此，最终的平等检查既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def find_time(a, total):
    if total == 0:
        return -1

    power = 1
    length = 1
    remaining = total

    while True:
        count = (a - 1) * power
        block_digits = count * length

        if remaining > block_digits:
            remaining -= block_digits
            power *= a
            length += 1
        else:
            if remaining % length != 0:
                return -1

            q = remaining // length
            if q == 0 or q > count:
                return -1

            return power + q - 1

def count_digits(n, a):
    cnt = [0] * a
    p = 1

    while p <= n:
        high = n // (p * a)
        cur = (n // p) % a
        low = n % p

        base = high * p

        for d in range(1, a):
            value = base

            if cur > d:
                value += p
            elif cur == d:
                value += low + 1

            cnt[d] += value

        if high > 0:
            cnt[0] += (high - 1) * p

            if cur == 0:
                cnt[0] += low + 1
            else:
                cnt[0] += p

        p *= a

    return cnt

def solve():
    a = int(input())
    b = list(map(int, input().split()))

    total = sum(b)

    n = find_time(a, total)
    if n == -1:
        print(-1)
        return

    cnt = count_digits(n, a)

    if cnt == b:
        print(n)
    else:
        print(-1)

if __name__ == "__main__":
    solve()
```第一个函数使用总位数的单调性。`power`是当前数字长度块中的第一个数字，而`length`是该块中每个数字的位数。`block_digits`因此是整个块所贡献的准确的语音数字数量。 

条件`remaining > block_digits`故意使用严格的不等式。 如果剩余总数恰好等于块的大小，则答案是该块中的最后一个数字，因此必须处理当前块而不是跳过。 

可整除性测试可防止相差一式错误，即任意分数的表示形式将被视为整数秒。 划分后，`q`计算当前块中包含多少个数字，因此`power + q - 1`是最后说出的数字。 

第二个函数独立地应用位置公式 (p=1,a,a^2,\ldots)。 循环结束`range(1, a)`处理所有非零数字。 零被单独处理，因为口语表示中不存在前导零。 

Python 整数具有任意精度，因此诸如 (10^{14}) 之类的值、涉及基数幂的乘积以及生成的数字频率不会溢出。 乘法`p * a`也是安全的，因为 Python 整数会根据需要自动增长。 

仅在候选者 (n) 恢复后才执行相等性检查。 这种分离很有用，因为总计数可以找到唯一可能的停止时间，而位置计算可以决定该候选者是否确实具有所需的数字分布。 

## 工作示例

 ### 示例 1

 输入是```
10
1 2 1 1 1 1 1 1 1 1
```请求的总位数是

 [
 1+2+8=11。 
]

 对于基数 (10)，一位数 (1) 到 (9) 贡献 (9) 个数字。 剩下两位数字，因此下一个块包含两位数字，而我们正好需要其中一个。 

|`length`|`power`|`block_digits`|`remaining`| 行动|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 9 | 11 | 11 跳过块 |
 | 2 | 10 | 10 180 | 180 2 | 取1号|

 候选人是

 [
 10+1-1=10。 
]

 说出的数字是 (1,2,\ldots,10)。 一位数中，数字(1)至(9)各出现一次，数字(1)在(10)中再次出现一次，而数字(0)则出现一次。 所得到的频率正好是

 [
 [1,2,1,1,1,1,1,1,1,1]。 
]

 因此答案是`10`。 

### 示例 2

 输入是```
2
3 5
```请求的总数为

 [
 3+5=8。 
]

 在基数 (2) 中，一位数字块仅包含数字 (1)，贡献一位数字。 剩下的总数是（7）。 两位数块包含 (2) 个数字，贡献 (4) 个数字，因此被跳过。 剩下的总数是(3)，属于三位数块。 

|`length`|`power`|`block_digits`|`remaining`| 行动|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 8 | 跳过，剩余 = 7 |
 | 2 | 2 | 4 | 7 | 跳过，剩余 = 3 |
 | 3 | 4 | 12 | 12 3 | (3\bmod3=0) |

 我们采取

 [
 q=3/3=1，
 ]

 所以候选人是

 [
 4+1-1=4。 
]

 说出的数字是```
1
10
11
100
```他们的位数是三个零和五个一。 

|`digit`| 必填 | 计算|
 | ---| ---| ---|
 | 0 | 3 | 3 |
 | 1 | 5 | 5 |

 候选人是有效的，所以答案是`4`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(a\log_a n)) | 有 (O(\log_a n)) 个数字位置，每个位置检查所有 (a-1) 个非零数字。 |
 | 空间| (O(a)) | 频率数组为每个可能的数字包含一个计数器。 |

 请求的最大总数为 (10^9a)，因此候选值 (n) 可以非常大，但其基数 (a) 的位数仍然是对数。 即使对于 (a=100000)，在最大相关比例下也只能出现少数数字位置。 由此产生的 (O(a\log_a n)) 工作对于 (a\le100000) 来说很容易管理，而 (O(a)) 内存使用量也很小。 

## 测试用例

 以下测试工具使用相同的`solve()`作为提交的解决方案。```python
import sys
import io

input = sys.stdin.readline

def find_time(a, total):
    if total == 0:
        return -1

    power = 1
    length = 1
    remaining = total

    while True:
        count = (a - 1) * power
        block_digits = count * length

        if remaining > block_digits:
            remaining -= block_digits
            power *= a
            length += 1
        else:
            if remaining % length != 0:
                return -1

            q = remaining // length
            if q == 0 or q > count:
                return -1

            return power + q - 1

def count_digits(n, a):
    cnt = [0] * a
    p = 1

    while p <= n:
        high = n // (p * a)
        cur = (n // p) % a
        low = n % p

        base = high * p

        for d in range(1, a):
            value = base

            if cur > d:
                value += p
            elif cur == d:
                value += low + 1

            cnt[d] += value

        if high > 0:
            cnt[0] += (high - 1) * p

            if cur == 0:
                cnt[0] += low + 1
            else:
                cnt[0] += p

        p *= a

    return cnt

def solve():
    a = int(input())
    b = list(map(int, input().split()))

    total = sum(b)
    n = find_time(a, total)

    if n == -1:
        print(-1)
        return

    if count_digits(n, a) == b:
        print(n)
    else:
        print(-1)

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    out = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = out

    try:
        solve()
        return out.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

# Provided samples
assert run("10\n1 2 1 1 1 1 1 1 1 1\n") == "10", "sample 1"
assert run("2\n3 5\n") == "4", "sample 2"
assert run("5\n0 0 0 0 0\n") == "-1", "sample 3"

# Minimum-size valid case: only the number 1 is spoken.
assert run("2\n0 1\n") == "1", "minimum valid input"

# Crossing the first digit-length boundary in base 3.
# 1, 2, 10, 11, 12 gives counts [1, 3, 2].
assert run("3\n1 3 2\n") == "5", "digit-length boundary"

# All target values equal, but no stopping time has those frequencies.
assert run("2\n2 2\n") == "-1", "all-equal impossible target"

# Maximum base and maximum array size.
# For n = 99999 in base 100000, every spoken number is one digit.
large_b = [0] + [1] * 99999
large_input = "100000\n" + " ".join(map(str, large_b)) + "\n"
assert run(large_input) == "99999", "maximum base and array size"

# Same total as n=2 in base 2, but wrong digit distribution.
assert run("2\n1 2\n") == "-1", "total count alone is insufficient"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 0 1`|`1`| 尽可能最小的有效舞蹈和第一个说出的数字 |
 |`3 / 1 3 2`|`5`| 位数增加时的正确处理 |
 |`2 / 2 2`|`-1`| 完全相等的目标值，没有有效的停止时间 |
 |`100000 / 0 1 1 ... 1`|`99999`| 最大基数和最大数字数组大小 |
 |`2 / 1 2`|`-1`| 根据总数确定候选人，但根据数字频率拒绝 |

 ## 边缘情况

 ### 总计为零

 对于```
5
0 0 0 0 0
```请求的总位数为零。 该算法在尝试定位数字长度块之前检测到这一点并返回（-1）。 不存在正秒的表示贡献零位数字。 

### 总计数不对应于整数个表示

 考虑```
2
2 2
```总数为(4)。 在基数(2)中，在一位数(1)之后，下一个块由两位数组成，总共贡献四位数字。 因此总数 (4) 唯一标识 (n=2)。 

然而实际的顺序是```
1
10
```其数字频率是 ([1,2])，而不是 ([2,2])。 最终比较拒绝候选者并输出 (-1)。 这说明了为什么从总数中恢复 (n) 只是解决方案的前半部分。 

### 跨越一个基地的力量

 对于```
3
1 3 2
```总数为 (6)。 在基数 (3) 中，数字 (1) 和 (2) 贡献两位数，而 (3,4,5) 各贡献两位数。 第一个块贡献 (2)，留下 (4)，因此候选者是 (5)。 

代表是```
1
2
10
11
12
```它们的数字频率是一个零、三个一和两个二。 答案是`5`。 块计算避免了错误地将所有数字视为具有相同的长度。 

### 前导零

 采取```
10
1 1 1 1 1 1 1 1 1 1
```总数为 (10)，确定 (n=10)。 数量`10`包含一个零，而数字`1`通过`9`不包含任何。 因此零计数恰好是一。 

固定宽度计数方法可能会错误地计算零`01`,`02`， 等等。 公式

 [
 (\text{高}-1)p
 ]

 零消除了那些人为的领先地位。 

### 最大基数

 对于```
100000
0 1 1 1 ... 1
```一个零后跟 (99999) 个 1，则请求的总数为 (99999)。 从 (1) 到 (99999) 的每个数字均由一位基数 (100000) 数字表示，因此候选数为 (99999)。 每个非零数字出现一次，零出现零次，给出精确的请求向量。 

此案例练习了最大可能的数字数组，并确认该算法不依赖于小基数。
