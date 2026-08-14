---
title: "CF 102426B - 时间的秘密"
description: "根本没有输入。 我们只需要打印一个正整数（x），其平方是满足几位条件的16位十进制数。"
date: "2026-08-14T15:27:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102426
codeforces_index: "B"
codeforces_contest_name: "The 7-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 102426
solve_time_s: 218
verified: true
draft: false
---

[CF 102426B - 时间的秘密](https://codeforces.com/problemset/problem/102426/B)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 根本没有输入。 我们只需要打印一个正整数（x），其平方是满足几位条件的16位十进制数。 

从右边数起，方格的第 1 和第 13 位必须有数字 1，第 3 位有数字 9，第 5 位有数字 2，第 7 位有数字 6，第 9 位有数字 0，第 11 位有数字 8，第 15 位有数字 7。其余 8 位数字不受限制。 由于该声明明确允许任何有效密码，因此找到一名证人就足够了。 

查看条件的最有用方法是作为 (x^2) 的十进制表示形式的约束。 从左边开始，有效的正方形具有以下形式

 [
 7_1_8_0_6_2_9_1。 
]

 前导固定数字给出了令人惊讶的强界限。 因为前两位数是（7），所以正方形位于区间内

 [
 7\cdot10^{15} \le x^2 < 8\cdot10^{15}。 
]

 因此，(x) 位于 (\sqrt{7\cdot10^{15}}) 和 (\sqrt{8\cdot10^{15}}) 之间，大约从 8370 万到 8940 万。 只有大约 580 万个根是相关的，而不是每个平方有 16 位数字的整数。 

不存在普通的输入边缘情况，因为输入流根据定义是空的。 该实现仍然必须正确处理空流，而不是尝试读取整数并阻塞或失败。 另一个容易犯的错误是从左边而不是右边解释固定数字。 例如，一个正方形，例如`701080006020901`有可见子串`19260817`嵌入其十进制结构中，但它只有 15 位数字，不是有效目标。 位置必须从最低有效数字开始计数。 

第二个常见错误是仅检查可见的固定数字，而忘记结果实际上必须是完全平方数。 例如，与模式匹配的数字`7_1_8_0_6_2_9_1`不会自动被接受。 该程序必须从候选根开始，对其求平方，然后验证数字位置。 

## 方法

 直接蛮力在概念上很简单。 枚举平方有 16 位的每个正整数，计算其平方，将其转换为小数，并测试八个固定位置。 第一个可能的根是 (\lceil\sqrt{10^{15}}\rceil=31,622,777)，最大的是 (\lfloor\sqrt{10^{16}-1}\rfloor=99,999,999)。 共有 68,377,223 名候选人。 每个候选者都需要进行乘法和数字检查，这对于具有一秒限制的问题而言不必要地大。 

小数约束的结构为我们提供了更好的过滤器。 最后一个固定数字是 1，因此根必须以 1 或 9 结尾。更严格地说，平方右侧的第三个数字必须是 9。该条件仅取决于根模 (1000)，因为 (x^2\bmod1000) 仅取决于 (x\bmod1000)。 

我们可以枚举一次模 1000 的 1000 个可能的残基，并只保留平方具有个位数 1 和百位数字 9 的残基。这样就只剩下一小部分可能的根后缀。 

我们还可以在搜索之前使用前导数字约束。 所需的左起第二位数字是 7，因此正方形位于 (7\cdot10^{15}) 和 (8\cdot10^{15}) 之间。 我们精确地计算这些平方根界限`math.isqrt`。 

暴力搜索现在已经变成了经过严格过滤的搜索。 我们不检查数千万个根，而是仅检查后三位数字已经满足两个固定条件的狭窄前导范围内的根。 对于每个这样的根，我们计算其平方并测试其余位置。 候选数只有大约几十万，所以这在 Python 中是相当小的。 

暴力方法之所以有效，是因为搜索空间是有限的，并且直接检查每个候选者，但它几乎将所有时间都浪费在根上，而根的最后三位数字使得最终答案不可能。 小数点位置是由 10 的模幂确定的观察结果让我们在进行全面验证之前丢弃这些根。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(10^8)) | (O(1)) | (O(1)) | 太慢了 |
 | 最佳 | (O(10^6)) 最坏情况，常数很小 | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 计算平方至少为 (7\cdot10^{15}) 的最小整数，以及平方小于 (8\cdot10^{15}) 的最大整数。 这些正是其平方可以具有所需的前两位数字的根。 
2. 枚举从 0 到 999 的每个残数 (r)。计算 (r^2\bmod1000)，如果个位为 1，百位为 9，则保留 (r)。任何有效的根都必须将这些残数之一作为其最后三位。 
3. 对于每个保留的残差，在允许的区间内找到该残差模 1000 的第一个根。然后每次将根增加 1000。 这会访问带有该后缀的每个根一次。 
4. 对每个候选者进行平方。 该正方形已经具有所需的前导范围，并且其后三位数字满足两个最低的固定条件，因此只需要检查剩余的固定位置。 
5. 将平方转换为十进制字符串并检查从右侧开始的位置 5、7、9、11、13 和 15。 当所有六个位置都匹配时，打印根并停止。 
6. 因为该问题保证密码存在，并且检查过滤搜索中的每个可能的候选者，所以搜索最终到达有效的根。 

关键的不变量是算法跳过的每个根都是不可能的。 前导区间之外的根无法生成以 7 开头的平方。丢弃模 1000 的余数的根无法生成以所需单位和百位数结尾的平方。 每个剩余的根都直接针对每个其他固定位置进行测试。 因此，算法打印的第一个根必然是有效的密码。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from math import isqrt

def find_answer():
    # The square must start with digit 7 and have exactly 16 digits.
    lo = isqrt(7 * 10**15 - 1) + 1
    hi = isqrt(8 * 10**15 - 1)

    # A valid square has:
    # position 1 from the right = 1
    # position 3 from the right = 9
    #
    # Both conditions depend only on x modulo 1000.
    residues = []
    for r in range(1000):
        v = r * r % 1000
        if v % 10 == 1 and (v // 100) % 10 == 9:
            residues.append(r)

    # Remaining fixed digits, indexed by their position from the right.
    required = {
        4: 2,   # position 5
        6: 6,   # position 7
        8: 0,   # position 9
        10: 8,  # position 11
        12: 1,  # position 13
        14: 7,  # position 15
    }

    for r in residues:
        # First x >= lo such that x % 1000 == r.
        x = lo + (r - lo) % 1000

        while x <= hi:
            sq = x * x
            s = str(sq)

            ok = True
            for pos, digit in required.items():
                if s[-1 - pos] != str(digit):
                    ok = False
                    break

            if ok:
                return x

            x += 1000

    raise RuntimeError("A valid password was not found")

def solve():
    print(find_answer())

if __name__ == "__main__":
    solve()
```该程序首先导出根区间而不是硬编码近似边界。`isqrt`执行精确的整数平方根，因此任一端点附近都不存在浮点舍入风险。 

剩余建筑利用`r * r % 1000`。 表达式`v % 10`检查个位，同时`(v // 100) % 10`提取百位数。 由于模 1000 的平方完全由其根的最后三位数字确定，因此丢弃所有其他余数在数学上是安全的。 

对于每个幸存的残基，`(r - lo) % 1000`计算达到该残差所需的最小非负调整。 之后添加 1000 会保留残数，因此不会跳过任何候选者。 

字典`required`从右侧使用从零开始的位置。 问题中的位置 5 在此表示中是索引 4，因此字符串访问是`s[-1 - pos]`。 此索引是产生相差一错误的常见位置。 已由残留物过滤器保证的两个位置在第二次检查中被故意省略。 

Python 整数具有任意精度，因此平方拟合不会出现任何溢出问题。 最大相关根在9000万以下，其平方在(10^{16})以下。 

## 工作示例

 没有普通的样本输入，因为原始问题没有输入。 以下跟踪说明了两个不同候选根的过滤过程。 第一个候选者被拒绝，因为所需的中间数字之一是错误的，而第二种类型的跟踪表示一旦每个固定数字都同意就成功的路径。 

对于最后三位数字为 089 的候选人，残差测试成功，因为

 [
 89^2=7921,
 ]

 因此正方形的个位数字为 1，百位数字为 9。 

| 舞台| 根后缀| 方形后缀 | 结果 |
 | --- | --- | --- | --- |
 | 残留检查| 089| 921 | 921 通行证 |
 | 位置 5 | 2 | 2 | 通行证 |
 | 位置 7 | 6 | 6 | 通行证 |
 | 位置 9 | 0 | 9 | 失败|

 这说明了为什么仅检查后缀是不够的。 候选人可以满足低位约束，但在较高的小数位上失败。 

对于通过所有筛选的候选者，最终验证将检查完整的 16 位数字方块。 

| 位置从右| 必填数字| 候选数字| 结果 |
 | --- | --- | --- | --- |
 | 1 | 1 | 1 | 通行证 |
 | 3 | 9 | 9 | 通行证 |
 | 5 | 2 | 2 | 通行证 |
 | 7 | 6 | 6 | 通行证 |
 | 9 | 0 | 0 | 通行证 |
 | 11 | 11 8 | 8 | 通行证 |
 | 13 | 1 | 1 | 通行证 |
 | 15 | 15 7 | 7 | 通行证 |

 第二条轨迹确认了搜索所使用的不变量。 每个所需的位置都是独立检查的，因此只有在验证整个图案后才会打印候选位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 过滤搜索中的 (O(10^6)) | 仅检查具有有效模 1000 后缀的前导区间中的根 |
 | 空间| (O(1)) | (O(1)) | 残基列表最多包含 1000 个条目，所有其他状态都是恒定大小的 |

 原来的16位平方范围包含数千万个可能的根。 将平方限制为主导模式可将其减少到大约 580 万个根，并且限制模 1000 的根可将实际候选数减少大约十到一百的另一个因子，具体取决于幸存的残基。 生成的搜索对于一秒的限制来说足够小，并且使用的内存可以忽略不计。 

## 测试用例

 由于原始问题没有输入，因此有意义的测试会验证生成的密码，而不是将其与固定的示例输出进行比较。 允许使用多个有效密码，因此检查特定的数字答案将受到不必要的限制。```python
# helper: run the solver on an input string and return its output
import sys
import io
from math import isqrt

def find_answer():
    lo = isqrt(7 * 10**15 - 1) + 1
    hi = isqrt(8 * 10**15 - 1)

    residues = []
    for r in range(1000):
        v = r * r % 1000
        if v % 10 == 1 and (v // 100) % 10 == 9:
            residues.append(r)

    required = {
        4: 2,
        6: 6,
        8: 0,
        10: 8,
        12: 1,
        14: 7,
    }

    for r in residues:
        x = lo + (r - lo) % 1000

        while x <= hi:
            sq = x * x
            s = str(sq)

            if all(s[-1 - pos] == str(digit)
                   for pos, digit in required.items()):
                return x

            x += 1000

    raise RuntimeError("No answer found")

def solve():
    print(find_answer())

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

def valid_password(x: int) -> bool:
    sq = x * x
    s = str(sq)

    if len(s) != 16:
        return False

    required = {
        0: '1',
        2: '9',
        4: '2',
        6: '6',
        8: '0',
        10: '8',
        12: '1',
        14: '7',
    }

    return all(s[-1 - pos] == digit
               for pos, digit in required.items())

# Provided sample: the problem has no input.
answer = int(run(""))
assert valid_password(answer), "sample 1"

# Empty input with a trailing newline.
answer = int(run("\n"))
assert valid_password(answer), "empty input"

# Whitespace-only input.
answer = int(run("   \n\n"))
assert valid_password(answer), "whitespace input"

# Repeated empty invocations must still produce a valid password.
answer = int(run(""))
assert valid_password(answer), "repeated empty input"

# Boundary-oriented validation.
answer = int(run("\n\n\n"))
sq = answer * answer
assert 7 * 10**15 <= sq < 8 * 10**15, "leading digit constraint"
assert len(str(sq)) == 16, "16-digit square"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 空输入| 任意有效密码 | 提供的样本格式 |
 |`\n`| 任意有效密码 | 带换行符的空输入 |
 | 仅空白 | 任意有效密码 | 解决方案不依赖于输入解析 |
 | 几个换行符 | 任意有效密码 | 重复空输入行为 |
 | 具有显式平方检查的空输入 | 任意有效密码 | 前导范围、长度和所有固定数字 |

 ## 边缘情况

 第一个边缘情况是空输入本身。 在没有数据的情况下运行程序仍必须生成密码。 该实现从不调用`input()`因为没有什么可读取的，所以自然就处理空流了。 

第二个边缘情况是一个根，其最后三位数字看起来很有希望，但其平方稍后会失败。 后缀如`089`产生一个以`921`，它满足个位 1 和百位 9。粗心的实现可能会到此为止，但完整的模式还要求从右边开始的第九位为 0。全平方检查捕获了此失败。 

第三种边缘情况涉及前导边界。 以 6 或 8 开头的方格无法满足所需的左起第二位数字，无论其较低的数字匹配得多么完美。 计算从 (7\cdot10^{15}) 到 (8\cdot10^{15}-1) 的区间会在昂贵的验证之前删除这些候选者。 

第四个边缘情况是位置 9 处的零数字。由于零是有效的十进制数字，因此实现必须显式地比较它，而不是将其视为不存在的数字。 字符串检查使用字符`'0'`，因此该位置有任何其他数字的正方形将被拒绝。
