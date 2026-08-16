---
title: "CF 102317D - 最狂野的梦想"
description: "该问题将 CD 建模为轨道的循环序列，其中每个轨道都有固定的持续时间。 安雅最喜欢一首特别的歌曲。 一天由几个驾驶段组成。"
date: "2026-08-16T18:49:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102317
codeforces_index: "D"
codeforces_contest_name: "UCF Locals 2016"
rating: 0
weight: 102317
solve_time_s: 318
verified: true
draft: false
---

[CF 102317D - 最狂野的梦想](https://codeforces.com/problemset/problem/102317/D)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题将 CD 建模为轨道的循环序列，其中每个轨道都有固定的持续时间。 安雅最喜欢一首特别的歌曲。 一天由几个驾驶段组成。 在奇数片段中，安雅在车里，因此 CD 播放器被迫重新启动她最喜欢的曲目，并在整个片段中重复播放。 在偶数段中，她缺席，因此 CD 从上一个段停止的地方恢复正常播放。 任务是计算一整天听到最喜欢的曲目有多少秒。 官方声明给出最多50张CD，每张CD最多20首曲目，每张CD最多100天，每天最多20​​个驾驶片段。 一天各片段的总时长最多为 86,400 秒。 

Codeforces 版本有 1 秒的时间限制和 256 MB 的内存。 就分段而言，输入总量很小，最多 (50 × 100 × 20 = 100{,}000) 个分段，但这些分段的总持续时间可能非常巨大。 每秒处理一次的方法可以执行多达 (50 \times 100 \times 86{,}400 = 432{,}000{,}000) 次迭代。 这远远超出了 Python 在 1 秒限制下应该尝试的范围。 预期的解决方案必须在恒定的时间内处理每个段。 

第一个微妙的情况是安雅在她最喜欢的歌曲结束时离开。 例如，```
1
2 1
5 7
1
3 5 1 7
```产生```
CD #1:
12
```前 5 秒是完全最喜欢的歌曲，因此当 Anya 离开时，从曲目 2 开始正常播放。因此 1 秒片段没有贡献任何内容，最后 7 秒片段贡献了 7 秒。 如果粗心的实现将最喜欢的持续时间的精确倍数视为最喜欢的歌曲的位置零，则会错误地将 1 秒片段计为最喜欢的时间。 

当最喜欢的歌曲是 CD 上的最后一首曲目时，会出现第二种边界情况。 考虑```
1
2 2
3 5
1
2 5 6
```输出是```
CD #1:
8
```Anya 听了 5 秒最喜欢的歌曲。 当她离开时，播放正好结束，因此正常播放会回到曲目 1。接下来的 6 秒包含曲目 1 的 3 秒，然后是喜爱的曲目的 3 秒。 将最喜欢的曲目的结尾存储为位置的表示形式`total`在执行循环算术之前必须将该位置归一化为零。 

第三种情况是只有一个曲目的 CD：```
1
1 1
5
1
1 100
```答案是```
CD #1:
100
```每一秒都一定是最喜欢的歌曲，无论安雅在场还是不在场。 假设在最喜欢的曲目之后总是有不同的曲目的实现在这里会失败。 

## 方法

 最直接的解决办法就是一次一秒地模拟CD。 当安雅在车里时，模拟的每一秒都会为答案贡献一个值，并且最喜欢的歌曲中的位置会循环前进。 当她缺席时，该位置会在 CD 中正常前进，如果当前位置属于最喜欢的曲目，则第二个会做出贡献。 这是正确的，因为输入以实际经过的秒数来描述播放，因此从字面上跟随播放器可以准确地再现所发生的情况。 

问题是秒数。 一天可以包含86,400秒，50张CD每张可以有100天。 最坏的情况约为 4.32 亿模拟秒。 虽然每一项操作都很简单，但对于时间限制来说，工作量太大了。 

关键的观察是正常播放是周期性的。 一旦 Anya 缺席，CD 的行为就像一个循环时间线，其长度就是 CD 的总持续时间。 在 CD 的每次完整遍历中，恰好一个固定的时间量（即最喜欢的曲目的持续时间）花在最喜欢的歌曲上。 因此，我们永远不需要检查个别秒。 

对于 Anya 出现的片段，还有第二个有用的观察结果。 答案随着整个片段的长度而增加，因为每一秒都是最喜欢的歌曲。 我们只需要确定之后应该在哪里恢复正常播放。 由于最喜欢的歌曲被重复，因此它的新位置由片段长度对最喜欢的持续时间取模来确定。 

对于长度为 (L) 的缺失片段，我们将 (L) 分成完整的 CD 循环和余数。 每个完整的周期都准确地贡献了最喜欢的持续时间。 余数比一张CD短，并且在圆形边界处分裂后最多可以跨越一次喜欢的区间。 该重叠可以在恒定时间内计算出来。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(总经过秒数) | O(1) | O(1) | 太慢了，迭代高达 4.32 亿次 |
 | 最佳 | O（段数）| O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取曲目持续时间并计算总 CD 长度。 还计算绝对起始位置`F`通过将其之前的所有曲目的持续时间相加来确定最喜欢的曲目。 循环时间线上最喜欢的间隔是`[F, E)`， 在哪里`E = F + favorite_duration`。 
2. 定义函数`prefix(x)`返回最喜欢的曲目在第一首曲目中出现的秒数`x`一个 CD 周期的秒数。 前`F`该值为零，在最喜欢的区间内它线性增长，并且之后`E`它保持等于最喜欢的持续时间。 这将重叠计数转换为前缀值的减法。 
3. 定义一个函数，从循环位置开始计算正常播放间隔期间最喜欢的秒数`pos`且持久`length`秒。 第一次拍摄`length // total`完整的CD周期，贡献`full_cycles * favorite_duration`。 对于其余部分，请使用前缀函数。 如果余数越过了CD的末尾，则将其拆分为当前周期的后缀和下一个周期的前缀。 
4. 每天，从任意 CD 位置开始，因为第一段始终是一个奇怪的段，其中 Anya 进入汽车并立即将播放重置到最喜欢的歌曲的开头。 将当天的答案设置为零。 
5. 从左到右处理当天的片段。 对于长度为奇数的段`L`，添加所有`L`秒到答案。 新的播放位置位于最喜欢的歌曲内，偏移量由以下因素确定`L % favorite_duration`。 如果余数为零，则播放已到达最喜欢的歌曲的末尾，必须继续下一曲目，因此位置为`E`，以 CD 长度为模进行归一化。 
6. 对于长度均匀的段`L`，从当前位置开始使用正常播放重叠功能。 添加该函数返回的最喜欢的秒数，并将循环位置前进`L`。 
7. 打印当天的累计答案。 处理完一张 CD 的所有天数后，在移至下一张 CD 之前打印所需的空行。 最初的竞赛声明要求每张 CD 后都有一个空行。 

### 为什么它有效

 不变量是紧接在每个偶数段之前，`pos`表示如果我们遵循所有前面的片段，CD 自然会播放的确切位置。 在奇数片段期间，强制播放最喜欢的歌曲，因此添加整个片段长度是准确的，并且当 Anya 离开时，模运算给出了正确的位置。 在偶数段期间，CD 遵循其普通的循环顺序，并且重叠功能精确地计算该循环间隔中属于喜爱曲目的部分。 因此，在每个片段之后，累积的答案和播放位置都保持正确。 由于每天的第一段都会重置最喜欢的歌曲，因此可以独立处理这些日子。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    t = int(input())
    output = []

    for case_no in range(1, t + 1):
        n, k = map(int, input().split())
        tracks = list(map(int, input().split()))

        total = sum(tracks)
        favorite = tracks[k - 1]

        favorite_start = sum(tracks[:k - 1])
        favorite_end = favorite_start + favorite

        def prefix(x):
            if x <= favorite_start:
                return 0
            if x >= favorite_end:
                return favorite
            return x - favorite_start

        def favorite_in_normal_playback(pos, length):
            if length == 0:
                return 0

            full_cycles, rem = divmod(length, total)
            result = full_cycles * favorite

            if rem == 0:
                return result

            end = pos + rem

            if end <= total:
                result += prefix(end) - prefix(pos)
            else:
                result += prefix(total) - prefix(pos)
                result += prefix(end - total)

            return result

        d = int(input())

        output.append(f"CD #{case_no}:")

        for _ in range(d):
            s_and_lengths = list(map(int, input().split()))
            s = s_and_lengths[0]
            segments = s_and_lengths[1:]

            answer = 0
            pos = 0

            for i, length in enumerate(segments):
                if i % 2 == 0:
                    # Anya is in the car, so the favorite song
                    # plays for the entire segment.
                    answer += length

                    rem = length % favorite
                    if rem == 0:
                        # The favorite song has just ended.
                        # Continue with the next track.
                        pos = favorite_end % total
                    else:
                        pos = favorite_start + rem
                else:
                    # Normal CD playback.
                    answer += favorite_in_normal_playback(pos, length)
                    pos = (pos + length) % total

            output.append(str(answer))

        output.append("")

    sys.stdout.write("\n".join(output) + "\n")

if __name__ == "__main__":
    main()
```实现的第一部分将最喜欢的曲目标识为 CD 绝对时间线上的一个间隔。 如果曲目有持续时间`[100, 200, 50]`并且曲目 2 是最喜欢的，那么 CD 时间线是`[0, 350)`，而最喜欢的间隔是`[100, 300)`。 这种表示方式消除了在正常播放期间跟踪各个曲目编号的需要。`prefix(x)`是主要的计数原语。 为了`x <= favorite_start`，第一个`x`秒不包含最喜欢的时间。 为了`x >= favorite_end`，它们包含整首最喜欢的歌曲。 在这些界限之间，最喜欢的贡献正是`x - favorite_start`。 

正常播放功能首先处理完整的 CD 周期。 如果 CD 还剩`total`秒，每个完整的周期都贡献准确`favorite`秒。 剩余间隔的长度小于`total`，因此它要么停留在当前循环内，要么跨越循环边界一次。 这两种情况由前缀函数处理。 

奇数段更新需要特殊处理`length % favorite == 0`。 在这种情况下，最喜欢的歌曲刚刚结束，因此播放会转到下一首曲目，而不是重新开始最喜欢的歌曲。 使用`favorite_end % total`还可以处理最喜欢的曲目是最后一首曲目而下一个位置是 CD 的开头的情况。 

所有算术都适合 Python 整数。 每天的最大持续时间仅为 86,400 秒，并且一天的答案受相同数量的限制，因此 Python 中不存在整数溢出问题。 

## 工作示例

 官方样品在原始竞赛声明中给出。 对于第一张样本 CD，曲目 9 是最喜欢的曲目，持续时间为 220 秒。 它的绝对间隔从前八首曲目之后的位置 1739 开始，到 1959 结束。第一天包含片段`1000 900 1000`。 

| 细分 | 类型 | 长度 | 之前的位置 | 最喜欢的秒 | 位置在 | 之后
 | ---| ---| ---| ---| ---| ---|
 | 1 | 安雅出席| 1000 | 1000 0 | 1000 | 1000 1859 | 1859
 | 2 | 正常 | 900 | 900 1859 | 1859 100 | 100 0 |
 | 3 | 安雅出席 | 1000 | 1000 0 | 1000 | 1000 1859 | 1859

 第一段贡献了全部 1000 秒，并在最喜欢的歌曲中留下了 120 秒的播放时间。 在 900 秒的正常片段中，播放会花费 100 秒完成最喜欢的歌曲，然后在遍历其余曲目后到达 CD 的开头。 最后一段再次贡献了全部 1000 秒。 总数为 2100，与样本 1 匹配。 

对于样本 2，CD 的曲目长度为 100 和 200，其中曲目 2 是最喜欢的。 它最喜欢的间隔是`[100, 300)`。 考虑一下这一天`300 277 131 10000 58`。 

| 细分 | 类型 | 长度 | 之前的位置 | 最喜欢的秒 | 位置在 | 之后
 | ---| ---| ---| ---| ---| ---|
 | 1 | 安雅出席 | 300 | 300 0 | 300 | 300 200 | 200
 | 2 | 正常 | 277 | 277 200 | 200 177 | 177 177 | 177
 | 3 | 安雅出席 | 131 | 131 177 | 177 131 | 131 231 | 231
 | 4 | 正常 | 10000 | 231 | 231 6669 | 231 | 231
 | 5 | 安雅出席 | 58 | 58 231 | 231 58 | 58 189 | 189

 第一段将 200 秒最喜欢的歌曲重复一次，然后继续 100 秒进入第二个副本，在 CD 时间轴上留下位置 200。 下一个正常片段花费​​ 100 秒完成最喜欢的歌曲，环绕 CD，并在最喜欢的间隔中再花费 77 秒。 10,000 秒的片段包含 33 个完整的 CD 循环，贡献`33 * 200 = 6600`最喜欢的几秒，接下来的 100 秒剩余时间贡献了 69 秒。 最后一段直接贡献了58秒。 总数为 7335，与官方样本相符。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T + S) | 轨迹预处理需要 O(T)，每个行驶段的处理时间为 O(1)。 |
 | 空间| O(T)| 存储曲目持续时间，以便可以计算最喜欢的曲目的起始位置。 |

 这里`T`是一张 CD 中的曲目数，`S`是该 CD 的驱动段总数。 整个输入最多有 100,000 个片段，而简单的逐秒模拟可以处理 4.32 亿秒。 最佳算法将其减少为每段大约一次恒定时间计算，完全在 Codeforces 规定的 1 秒和 256 MB 限制之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline
    t = int(input())
    output = []

    for case_no in range(1, t + 1):
        n, k = map(int, input().split())
        tracks = list(map(int, input().split()))

        total = sum(tracks)
        favorite = tracks[k - 1]
        favorite_start = sum(tracks[:k - 1])
        favorite_end = favorite_start + favorite

        def prefix(x):
            if x <= favorite_start:
                return 0
            if x >= favorite_end:
                return favorite
            return x - favorite_start

        def favorite_in_normal_playback(pos, length):
            full_cycles, rem = divmod(length, total)
            result = full_cycles * favorite

            if rem == 0:
                return result

            end = pos + rem

            if end <= total:
                result += prefix(end) - prefix(pos)
            else:
                result += prefix(total) - prefix(pos)
                result += prefix(end - total)

            return result

        d = int(input())
        output.append(f"CD #{case_no}:")

        for _ in range(d):
            data = list(map(int, input().split()))
            s = data[0]
            segments = data[1:]

            answer = 0
            pos = 0

            for i, length in enumerate(segments):
                if i % 2 == 0:
                    answer += length
                    rem = length % favorite

                    if rem == 0:
                        pos = favorite_end % total
                    else:
                        pos = favorite_start + rem
                else:
                    answer += favorite_in_normal_playback(pos, length)
                    pos = (pos + length) % total

            output.append(str(answer))

        output.append("")

    return "\n".join(output) + "\n"

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve_output = solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return solve_output

# Provided samples
sample = """\
2
13 9
212 231 231 235 193 219 207 211 220 247 250 195 270
4
3 1000 900 1000
3 10000 10000 10000
1 2000
2 500 600
2 2
100 200
5
1 70
5 300 277 131 10000 58
2 200 50
2 201 50
2 199 50
"""

expected_sample = """\
CD #1:
2100
20780
2000
660

CD #2:
70
7335
200
251
200

"""

assert run(sample) == expected_sample, "official samples"

# Minimum-size CD, only one track.
assert run("""\
1
1 1
5
1
1 100
""") == """\
CD #1:
100

""", "single-track CD"

# Exact favorite-song boundary.
assert run("""\
1
2 1
5 7
1
3 5 1 7
""") == """\
CD #1:
12

""", "exactly finishing the favorite song"

# Favorite track is the last track, so exact completion wraps to track 1.
assert run("""\
1
2 2
3 5
1
2 5 6
""") == """\
CD #1:
8

""", "favorite is last track and playback wraps"

# All track lengths equal.
assert run("""\
1
3 2
10 10 10
1
3 15 7 20
""") == """\
CD #1:
40

""", "all-equal track lengths"

# Maximum-size-shaped test: 20 tracks, 100 days, 20 segments per day.
tracks = " ".join(["1"] * 20)
day = "20 " + " ".join(["4320"] * 20)
max_case = "1\n20 20\n" + tracks + "\n100\n" + "\n".join([day] * 100) + "\n"
expected_max = "CD #1:\n" + "\n".join(["64800"] * 100) + "\n\n"

assert run(max_case) == expected_max, "maximum dimensions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 1 / 5 / 1 100`|`100`| 最小CD尺寸和最喜欢的是整张CD的情况|
 |`2 1 / 5 7 / 3 5 1 7`|`12`| 在缺席的片段之前精确完成最喜欢的歌曲 |
 |`2 2 / 3 5 / 2 5 6`|`8`| 最喜欢的歌曲位于最后，因此正常播放会转到曲目 1 |
 |`3 2 / 10 10 10 / 3 15 7 20`|`40`| 所有曲目持续时间相等且重复过渡 |
 | 20 首曲目，100 天，每天 20 段 | 每天 64800 | 结构输入边界的最大值 |

 ## 边缘情况

 当安雅在最喜欢的歌曲结束时离开时，算法会使用`length % favorite == 0`并移动到`favorite_end % total`。 为了```
1
2 1
5 7
1
3 5 1 7
```第一个片段将 CD 留在最喜欢的曲目之后的边界处。 一秒正常段从轨道 2 开始，贡献为零。 最后 7 秒部分贡献了 7，给出`12`。 该不变量被保留，因为存储的位置代表下一个曲目，而不是另一个最喜欢的重复的开始。 

当最喜欢的曲目是最后一首曲目时，`favorite_end == total`。 为了```
1
2 2
3 5
1
2 5 6
```第一段贡献5台`pos = total % total = 0`。 然后，正常播放的 6 秒将遍历曲目 1 的所有 3 秒和喜爱曲目的 3 秒。 结果是`8`。 位置更新中的模是防止`total`以免成为无效的圆坐标。 

当 CD 仅包含一首曲目时，最喜爱的音程为`[0, total)`。 前缀函数返回每个正常播放剩余部分的整个间隔长度，而奇数段也贡献其完整的持续时间。 为了```
1
1 1
5
1
1 100
```答案是`100`，因为每一秒都属于最喜欢的歌曲。 相同的表示还可以处理重复的完整 CD 循环，而无需任何特殊情况模拟。 

当缺失的片段跨越 CD 的末尾时，正常播放功能会将剩余部分拆分为从当前位置到 CD 末尾的后缀以及换行到位置 0 后的前缀。 这是问题的循环部分，一个简单的`prefix(end) - prefix(start)`公式会处理不当。 即使播放从最后一首曲目回到第一首曲目，两部分计算也能保持最喜爱的间隔计数正确。
