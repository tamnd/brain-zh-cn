---
title: "CF 102392D - 循环字符串？"
description: "令输入长度为(L=2n)。 输入是小写字母的多重集，因为原来的循环顺序已经被破坏了，只剩下符号了。 我们必须将这些字母重新排列成一个循环，使得长度为 (n) 的 (L) 个循环子串全部不同。"
date: "2026-08-10T19:28:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102392
codeforces_index: "D"
codeforces_contest_name: "2019-2020 ICPC Southeastern European Regional Programming Contest (SEERC 2019)"
rating: 0
weight: 102392
solve_time_s: 112
verified: true
draft: false
---

[CF 102392D - 循环字符串？](https://codeforces.com/problemset/problem/102392/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 令输入长度为(L=2n)。 输入是小写字母的多重集，因为原来的循环顺序已经被破坏了，只剩下符号了。 我们必须将这些字母重新排列成一个循环，使得长度为 (n) 的 (L) 个循环子串全部不同。 子字符串可能会跨越打印字符串的末尾，因此最后一个字符和第一个字符属于同一个循环。 官方声明确认了正好有(2n)个循环窗口可以区分。 

关键的难点在于字符串最多可以包含 (10^6) 个字符。 检查每种可能的排列的算法是完全不可能的，并且即使是显式地逐个字符比较所有（2n）个窗口的算法，如果重复多次，其成本也太高。 字母表只有 26 个字母，这是这里有用的小参数。 我们可以一次计算每个字符，然后根据这 26 个频率进行构建。 

有几个看似合理的构建失败的小案例。 为了`aa`，长度为四？ 不是，这里（L=2），所以需要的窗口长度是1。 两个循环窗口都是同一个字母，得出答案`NO`。 为了`aaaa`，（L=4）且所需的窗口长度为二。 每个排列包含两个连续的`a`字符，实际上是两个字母的窗口`aa`出现多次，所以答案是`NO`。 

边界情况`aabb`是不同的。 循环`aabb`有窗户`aa`,`ab`,`bb`， 和`ba`，所以这四个都是不同的，答案是`YES`。 诸如“重复的字符使得构造不可能”之类的粗心规则将拒绝这个有效的情况。 

另一个微妙的情况是`aaaabb`，长度为六，所需窗口长度为三。 有四份`a`和两份副本`b`。 没有任何安排可以避免重复长度为三的窗口，所以答案是`NO`。 相比之下，`aaaabc`有四个`a`字符和两个不同的剩余字母。 安排`aabaac`有窗户`aab`,`aba`,`baa`,`aac`,`aca`， 和`caa`，全部不同，因此必须接受这种边界情况。 

## 方法

 直接方法将枚举 (L) 符号的每个排列并测试其循环长度 (n) 窗口是否不同。 如果我们在枚举过程中将相等的符号视为不同的，则有（L！）个候选者。 对于每个候选，有 (L) 个循环窗口，并且逐个字符比较每个窗口的成本 (n)，给出 (O(L! \cdot L \cdot n)=O(L!L^2)) 个字符操作。 对于(L=10^6)，甚至生成候选者也是无需考虑的。 将相同的字母视为不可区分会减少候选者的数量，但在最坏的情况下仍然是阶乘。 

有用的观察是我们实际上不需要寻找一种安排。 答案几乎完全取决于最常见字符的出现频率。 设其频率为(m)。 当 (m\leq n=L/2) 时，只需对整个字符串进行排序就足够了。 当（m）变得大于（n）时，必须故意分割该字符的大块。 只有几个可能的频率范围，并且每个频率范围都有直接的构造。 这种基于频率的表征是公认的解决方案背后的中心思想。 已发布的竞赛问题解决方案正是使用了这些情况，包括异常 (m=L-2) 边界。 

排序结构在 (m\leq n) 时起作用的原因是，任何一个字符的运行都不能占用超过一半的周期。 在排序循环中，从不同位置开始的每个窗口在字符运行之间具有不同的转换模式。 重复的长度 (n) 窗口将强制两个起始位置在整个窗口中看到相同的运行边界，这将需要比 (n) 更长的字符运行时间。 频率限制排除了这一点。 

当 (m>n) 时，排序会产生太长的运行，因此我们将主导字符拆分为不同的字符。 如果 (m\leq L-3)，则获取 (n-1) 个主导字符副本，在其后面放置一个其他字符，将剩余的主导副本放在其后，并附加所有剩余字母。 特意放置的单个分隔符恰好在循环窗口可能发生碰撞的位置打破了长期运行。 

情况 (m=L-2) 是最严格的可行边界。 只有两个符号保留在主导字符之外。 如果不同，则将 (n-1) 个主导字符、第一个少数字符、另外 (n-1) 个主导字符和第二个少数字符放入有效循环。 如果两个少数符号相等，则除了四个之外，每个长度都无法构造。 对于长度四，`aabb`是有效的。 

最后，如果(m>L-2)，则至多有一个或两个位置被其他字符占据。 这就留下了太多由相同主导字符组成的长度（n）窗口，因此重复的窗口是不可避免的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(L!L^2)) | (O(L)) | 太慢了 |
 | 最佳| (O(L)) | (O(L)) | 已接受 |

 ## 算法演练

 1. 令 (L) 为输入长度并统计所有 26 个字母的出现次数。 查找出现频率最大 (m) 的字符 (a)。 我们只需要频率分布，因为原来的位置在洗牌后没有任何意义。 
2. 如果(L=2)，则当两个字符不同时完全接受。 每个循环窗口的长度为一，因此这两个位置必须包含不同的字母。 
3. 对于(L\geq3)，当(m>L-2)时立即拒绝。 非 (a) 字符太少，无法充分打破长 (a) 运行，因此某些长度 (n) 循环窗口必须重复。 
4. 如果(m=L-2)，检查不是(a)的两个字符。 如果它们相同，则拒绝，除非 (L=4)。 对于 (L=4)，多重集恰好是`{a,a,b,b}`， 和`aabb`作品。 
5. 如果(m=L-2)且两个少数字符不同，则构造
 (a^{n-1}ba^{n-1}c)。 
每个少数字符分隔一长块`a`字符，并且两个分隔符不同，因此两个边界周围的循环窗口不能重合。 
6. 如果 (n<m<L-2)，则选择任意字符 (b\neq a)，放入 (n-1) 个 (a) 副本，然后放入一个 (b)，然后放入 (a) 的所有剩余副本，最后放入所有剩余的非 (a) 字符。 得到的形式是
 (a^{n-1}ba^{m-n+1}R),
 其中 (R) 包含所有剩余的非 (a) 字符。 

第一个块恰好包含主导字符的 (n-1) 个副本，因此长度 (n) 的窗口不能完全保留在其中。 插入的 (b) 将两个主要块分开，而所有其他非 (a) 字符都被推迟到最后一个块。 这为每个循环窗口提供了相对于分离器结构的唯一位置。 
7. If (m\leq n)，按排序顺序输出字母。 最大游程的长度至多为 (n)，并且排序的循环排列在每个起始位置具有不同的游程边界模式。 因此，它的 (n) 长度窗口是两两不同的。 

### 为什么它有效

 所有构造背后的不变性是两个相等的循环窗口必须以完全相同的顺序遇到完全相同的字符运行序列。 在排序的情况下，重复的窗口将需要比 (n) 更长的运行时间，这与 (m\leq n) 相矛盾。 在重字符结构中，主导字符被分割，以便每个长度（n）窗口与插入的分隔符和剩余的非主导块具有唯一的关系。 在极端情况下（m=L-2），需要两个不同的少数字符来区分两个边界。 当(m>L-2)时，没有足够的分隔符来防止重复的全主导窗口，这证明是不可能的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_string(s: str):
    L = len(s)

    cnt = [0] * 26
    for ch in s:
        cnt[ord(ch) - 97] += 1

    if L == 2:
        if cnt[0] == 1 and cnt[1] == 1:
            return "YES", "ab"
        # More generally, any two different letters work.
        if max(cnt) == 1:
            letters = [chr(i + 97) for i, x in enumerate(cnt) if x]
            return "YES", "".join(letters)
        return "NO", ""

    mx = max(cnt)
    w = cnt.index(mx)
    a = chr(w + 97)

    if mx > L - 2:
        return "NO", ""

    others = [i for i in range(26) if cnt[i] and i != w]

    if mx == L - 2:
        if len(others) == 1:
            if L == 4:
                b = chr(others[0] + 97)
                return "YES", a * mx + b * cnt[others[0]]
            return "NO", ""

        b = chr(others[0] + 97)
        c = chr(others[1] + 97)
        half = L // 2
        ans = a * (half - 1) + b + a * (half - 1) + c
        return "YES", ans

    if mx > L // 2:
        b_idx = others[0]
        b = chr(b_idx + 97)

        first_a = L // 2 - 1
        remaining_a = mx - first_a

        cnt[b_idx] -= 1

        tail = []
        for i in range(26):
            if cnt[i]:
                tail.append(chr(i + 97) * cnt[i])

        ans = a * first_a + b + a * remaining_a + "".join(tail)
        return "YES", ans

    # mx <= L/2
    ans = []
    for i in range(26):
        if cnt[i]:
            ans.append(chr(i + 97) * cnt[i])

    return "YES", "".join(ans)

def main():
    s = input().strip()
    ok, ans = solve_string(s)

    if ok == "NO":
        print("NO")
    else:
        print("YES")
        print(ans)

if __name__ == "__main__":
    main()
```第一部分计算一次线性扫描中的字母数。 由于只有 26 个可能的字母，因此在扫描后查找最大频率并收集其他字符需要不断进行额外的工作。 

(L=2) 情况是单独处理的，因为一般 (L-2) 边界规则是为 (L\geq3) 编写的。 对于两个位置，所需的窗口长度为一，因此两个字母的相等立即确定答案。 

这`mx > L - 2`check 是全局不可能性条件。 它必须发生在构造分支之前，因为后面的分支在需要分隔符时假设至少存在两个非主导位置。 

什么时候`mx == L - 2`，剩余字符数正好是两个。`others`因此，要么有一个元素，意味着两个剩余位置都包含相同的字符，要么有两个元素，意味着它们不同。 长度为四的异常正是有效的`aabb`案件。 

为了`mx > L // 2`，第一个主导块有`L // 2 - 1`人物。 另一个字符的一个副本作为分隔符被删除，剩余的主要副本形成第二个主要块。 然后使用剩余的频率数组来附加所有未触及的字符。 在生成尾部之前减少分隔符计数至关重要，否则一份副本将被打印两次。 

最后一个分支只是排序的构造。 Python 字符串乘法在这里很有用，因为它直接构建大型重复块，并且 (10^6) 的输入大小足够大，以至于重复附加单个字符会不必要地昂贵。 

不需要子字符串散列或显式窗口比较。 构造本身给出了所需的属性，因此实现只需重现输入多重集。 

## 工作示例

 ### 示例 1

 输入是`cbbabcacbb`，其长度为(10)，因此所需的窗口长度为(5)。 其频率为（a=2）、（b=5）和（c=3）。 最大频率正好是(5=L/2)，因此适用排序结构。 

| 步骤| (左)| (n=L/2) | 最大频率| 分公司| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 数字母 | 10 | 10 5 | 5 | 计数| (a^2b^5c^3) |
 | 检查 (m>L-2) | 10 | 10 5 | 5 | 假| 继续 |
 | 检查 (m=L-2) | 10 | 10 5 | 5 | 假| 继续 |
 | 检查 (m>L/2) | 10 | 10 5 | 5 | 假 | 案例排序 |
 | 建设| 10 | 10 5 | 5 | 已排序 |`aabbbbbccc`|

 由此产生的循环是`aabbbbbccc`。 它的十个循环长度五窗口是`aabbb`,`abbbb`,`bbbbb`,`bbbbc`,`bbbcc`,`bbccc`,`bccca`,`cccaa`,`ccaab`， 和`caabb`。 

每个人都是不同的。 官方样本使用了另一种有效的安排，这是允许的，因为该问题接受任何满足条件的恢复。 

### 示例 2

 输入是`aa`，所以（L=2）。 两个字符相等，这意味着两个长度为 1 的循环窗口都是`a`。 

| 步骤| (左)| 最大频率| 分公司| 结果 |
 | --- | --- | --- | --- | --- |
 | 数字母 | 2 | 2 | 最小长度|`a`出现两次 |
 | 检查相等性 | 2 | 2 | 等号|`NO`|

 不可能重新排列，因为重新排列两个相等的符号不会改变任何事情。 这正是第二个样本的不可能情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(L)) | 输入被扫描一次，最多 (L) 个字符被写入答案。 |
 | 空间| (O(L)) | 输出字符串本身具有长度 (L)，而频率数组具有常量大小 26。 

对于 (L\leq10^6)，线性处理适合一秒限制，而阶乘或二次方法则远远超出可用预算。 该算法仅对输入执行几次传递并直接构造答案。 

## 测试用例```
# helper: run solution on input string, return output string
def run(inp: str) -> str:
    s = inp.strip()
    ok, ans = solve_string(s)
    if ok == "NO":
        return "NO\n"
    return "YES\n" + ans + "\n"

def valid_cycle(original: str, output: str) -> bool:
    lines = output.strip().splitlines()
    if lines[0] == "NO":
        return False

    ans = lines[1]
    if len(ans) != len(original):
        return False

    if sorted(ans) != sorted(original):
        return False

    L = len(ans)
    n = L // 2

    windows = set()
    for i in range(L):
        w = "".join(ans[(i + j) % L] for j in range(n))
        if w in windows:
            return False
        windows.add(w)

    return len(windows) == L

# Provided sample 1.
out = run("cbbabcacbb")
assert valid_cycle("cbbabcacbb", out), "sample 1"

# Provided sample 2.
assert run("aa") == "NO\n", "sample 2"

# Provided sample 3.
out = run("afedbc")
assert valid_cycle("afedbc", out), "sample 3"

# Minimum-size input.
assert run("ab") == "YES\nab\n", "minimum size"

# All characters equal.
assert run("aaaa") == "NO\n", "all equal"

# L = 6, max frequency = L - 2, with two different minority characters.
out = run("aaaabc")
assert out == "YES\naabaac\n", "two different minority characters"

# Heavy majority, but not at the impossible boundary.
out = run("aaaaabbc")
assert out == "YES\naaabaabc\n", "heavy majority construction"

# Maximum-size input, max frequency exactly L/2.
large = "a" * 500_000 + "b" * 500_000
out = run(large)
assert out.startswith("YES\n"), "maximum size"
assert out[4:].strip() == large, "maximum size sorted construction"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`ab`|`YES`和`ab`| 最小长度和独特的单字符窗口 |
 |`aaaa`|`NO`| 完全平等的边界和不可避免的重复窗口|
 |`aaaabc`|`YES`,`aabaac`| (m=L-2) 具有两个不同的少数字符 |
 |`aaaaabbc`|`YES`,`aaabaabc`| 重多数结构 (L/2<m<L-2) |
 | 50万`a`后跟 500,000 个字符`b`人物 |`YES`和排序后的字符串 | 最大输入大小和 (m=L/2) 边界 |

 ## 边缘情况

 对于`aa`，算法进入专用长度二分支。 最大频率为 2，因此所需的两个长度为 1 的窗口均为`a`。 它打印`NO`，匹配唯一可能的结果。 

为了`aaaa`，长度为四且(m=4>L-2=2)。 不可能检查立即触发。 没有足够的非`a`字符将循环分隔成不同长度的两个窗口，因此不再尝试稍后的构造。 

为了`aabb`，长度为四且(m=2=L/2=L-2)。 两个少数位置包含相同的字符，这通常使得 (L-2) 情况不可能出现。 特殊的长度为四的异常接受它并产生`aabb`。 其循环窗口为`aa`,`ab`,`bb`， 和`ba`。 

为了`aaaabb`，长度为 6 且 (m=4=L-2)，但两个少数位置均包含`b`。 由于长度不是四，算法打印`NO`。 问题不仅仅是排序失败。 任何排列都没有足够明显的分隔符来创建六个不同长度的三循环窗口。 

为了`aaaabc`，主导字符出现四次，正好是(L-2)，而其余两个字符不同。 结构为 (a^{2}ba^{2}c)，给出`aabaac`。 它的六个循环长度三窗口是`aab`,`aba`,`baa`,`aac`,`aca`， 和`caa`，所以每个窗口都是独一无二的。 

为了`aaaaabbc`，主导字符在长度为 8 的字符串中出现了五次。 这里(n=4)并且(n<m<L-2)，所以使用重多数结构。 它创造了`aaa`+`b`+`aa`+`bc`，即`aaabaabc`。 主字符围绕分隔符分开，防止在排序排列中出现重复的窗口。 

对于最大尺寸为 500,000 的情况`a`字符数和 500,000`b`字符，最大频率正好是（L/2）。 该算法落入已排序分支并输出相同的已排序字符串。 大输入通过线​​性频率计数和直接字符串构造进行处理，因此其大小不会改变渐近行为。
